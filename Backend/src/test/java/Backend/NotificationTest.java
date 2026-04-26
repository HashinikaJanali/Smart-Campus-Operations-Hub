package Backend;

import Backend.controller.NotificationController;
import Backend.model.Notification;
import Backend.model.NotificationSettings;
import Backend.model.User;
import Backend.repository.NotificationRepository;
import Backend.repository.NotificationSettingsRepository;
import Backend.repository.UserRepository;
import Backend.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class NotificationTest {

    // ── Controller Tests ─────────────────────────────────────────────────────

    @Nested
    @ExtendWith(MockitoExtension.class)
    @MockitoSettings(strictness = Strictness.LENIENT)
    class ControllerTests {

        @Mock
        private NotificationService notificationService;

        @Mock
        private UserRepository userRepository;

        @Mock
        private OAuth2User oauth2User;

        @InjectMocks
        private NotificationController notificationController;

        private User testUser;

        @BeforeEach
        void setUp() {
            testUser = new User("google123", "John Doe", "john@test.com", null);
            testUser.setId("user1");
            when(oauth2User.getAttribute("sub")).thenReturn("google123");
            when(userRepository.findByGoogleId("google123")).thenReturn(Optional.of(testUser));
        }

        @Test
        void getMyNotifications_returns401WhenPrincipalIsNull() {
            ResponseEntity<?> response = notificationController.getMyNotifications(null);

            assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        }

        @Test
        void getMyNotifications_returnsNotificationsForAuthenticatedUser() {
            List<Notification> notifications = List.of(
                new Notification("user1", "BOOKING_APPROVED", "Booking approved")
            );
            when(notificationService.getNotificationsForUser("user1")).thenReturn(notifications);

            ResponseEntity<?> response = notificationController.getMyNotifications(oauth2User);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals(notifications, response.getBody());
        }

        @Test
        void markAsRead_returnsUpdatedNotificationWithReadTrue() {
            Notification updated = new Notification("user1", "BOOKING_APPROVED", "Test");
            updated.setRead(true);
            when(notificationService.markAsRead("notif1")).thenReturn(updated);

            ResponseEntity<?> response = notificationController.markAsRead("notif1", oauth2User);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            Notification body = Objects.requireNonNull((Notification) response.getBody());
            assertTrue(body.isRead());
        }

        @Test
        void getUnreadCount_returnsCountMapWithCorrectValue() {
            when(notificationService.getUnreadCount("user1")).thenReturn(4L);

            ResponseEntity<?> response = notificationController.getUnreadCount(oauth2User);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            @SuppressWarnings("unchecked")
            Map<String, Object> body = Objects.requireNonNull((Map<String, Object>) response.getBody());
            assertEquals(4L, body.get("count"));
        }

        @Test
        void saveSettings_savesAndReturnsUpdatedSettings() {
            NotificationSettings incoming = new NotificationSettings();
            incoming.setDisableAll(true);

            NotificationSettings saved = new NotificationSettings();
            saved.setUserId("user1");
            saved.setDisableAll(true);
            when(notificationService.saveSettings(eq("user1"), any(NotificationSettings.class))).thenReturn(saved);

            ResponseEntity<?> response = notificationController.saveSettings(incoming, oauth2User);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            verify(notificationService).saveSettings(eq("user1"), any(NotificationSettings.class));
        }
    }

    // ── Service Tests ────────────────────────────────────────────────────────

    @Nested
    @ExtendWith(MockitoExtension.class)
    @SuppressWarnings("null")
    class ServiceTests {

        @Mock
        private NotificationRepository notificationRepository;

        @Mock
        private NotificationSettingsRepository notificationSettingsRepository;

        @InjectMocks
        private NotificationService notificationService;

        private NotificationSettings enabledSettings;

        @BeforeEach
        void setUp() {
            enabledSettings = new NotificationSettings();
            enabledSettings.setUserId("user1");
            enabledSettings.setDisableAll(false);
            enabledSettings.setBookingEnabled(true);
            enabledSettings.setTicketEnabled(true);
            enabledSettings.setCommentEnabled(true);
        }

        @Test
        void createNotification_savesAndReturnsWhenAllSettingsEnabled() {
            Notification saved = new Notification("user1", "BOOKING_APPROVED", "Booking approved");
            when(notificationSettingsRepository.findByUserId("user1")).thenReturn(Optional.of(enabledSettings));
            when(notificationRepository.save(any(Notification.class))).thenReturn(saved);

            Notification result = notificationService.createNotification("user1", "BOOKING_APPROVED", "Booking approved");

            assertNotNull(result);
            verify(notificationRepository).save(any(Notification.class));
        }

        @Test
        void createNotification_returnsNullWhenDisableAllIsTrue() {
            NotificationSettings disabledAll = new NotificationSettings();
            disabledAll.setDisableAll(true);
            when(notificationSettingsRepository.findByUserId("user1")).thenReturn(Optional.of(disabledAll));

            Notification result = notificationService.createNotification("user1", "BOOKING_APPROVED", "Test");

            assertNull(result);
            verify(notificationRepository, never()).save(any());
        }

        @Test
        void createNotification_createsAndSavesDefaultSettingsWhenNoneExist() {
            NotificationSettings defaults = new NotificationSettings();
            defaults.setUserId("user1");
            defaults.setDisableAll(false);
            defaults.setBookingEnabled(true);
            defaults.setTicketEnabled(true);
            defaults.setCommentEnabled(true);

            when(notificationSettingsRepository.findByUserId("user1")).thenReturn(Optional.empty());
            when(notificationSettingsRepository.save(any(NotificationSettings.class))).thenReturn(defaults);
            Notification saved = new Notification("user1", "BOOKING_APPROVED", "Test");
            when(notificationRepository.save(any(Notification.class))).thenReturn(saved);

            Notification result = notificationService.createNotification("user1", "BOOKING_APPROVED", "Test");

            assertNotNull(result);
            verify(notificationSettingsRepository).save(any(NotificationSettings.class));
        }

        @Test
        void markAsRead_setsReadFlagToTrue() {
            Notification notification = new Notification("user1", "BOOKING_APPROVED", "Test");
            notification.setId("notif1");
            notification.setRead(false);
            when(notificationRepository.findById("notif1")).thenReturn(Optional.of(notification));
            when(notificationRepository.save(any(Notification.class))).thenAnswer(inv -> inv.getArgument(0));

            Notification result = notificationService.markAsRead("notif1");

            assertTrue(result.isRead());
            verify(notificationRepository).save(notification);
        }

        @Test
        void saveSettings_updatesExistingSettingsFields() {
            NotificationSettings incoming = new NotificationSettings();
            incoming.setDisableAll(true);
            incoming.setBookingEnabled(false);
            incoming.setTicketEnabled(false);
            incoming.setCommentEnabled(false);
            when(notificationSettingsRepository.findByUserId("user1")).thenReturn(Optional.of(enabledSettings));
            when(notificationSettingsRepository.save(any(NotificationSettings.class))).thenAnswer(inv -> inv.getArgument(0));

            NotificationSettings result = notificationService.saveSettings("user1", incoming);

            assertTrue(result.isDisableAll());
            assertFalse(result.isBookingEnabled());
            assertFalse(result.isTicketEnabled());
            assertFalse(result.isCommentEnabled());
        }
    }
}
