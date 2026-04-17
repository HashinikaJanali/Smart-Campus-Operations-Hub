package Backend.service;

import Backend.model.Notification;
import Backend.model.NotificationSettings;
import Backend.repository.NotificationRepository;
import Backend.repository.NotificationSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationSettingsRepository notificationSettingsRepository;

    // Get all notifications for a user
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository
            .findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Create a new notification
    public Notification createNotification(String userId, 
                                           String type, 
                                           String message) {
        Notification notification = 
            new Notification(userId, type, message);
        return notificationRepository.save(notification);
    }

    // Mark one notification as read
    public Notification markAsRead(String notificationId) {
        Notification notification = notificationRepository
            .findById(notificationId)
            .orElseThrow(() -> 
                new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    // Mark all notifications as read for a user
    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository
            .findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    // Delete a notification
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    // Get notification settings for a user, creating defaults if not exists
    public NotificationSettings getSettings(String userId) {
        return notificationSettingsRepository.findByUserId(userId)
            .orElseGet(() -> {
                NotificationSettings defaults = new NotificationSettings();
                defaults.setUserId(userId);
                defaults.setDisableAll(false);
                defaults.setBookingEnabled(true);
                defaults.setTicketEnabled(true);
                defaults.setCommentEnabled(true);
                return notificationSettingsRepository.save(defaults);
            });
    }

    // Save notification settings for a user
    public NotificationSettings saveSettings(String userId,
                                             NotificationSettings incoming) {
        NotificationSettings existing = notificationSettingsRepository
            .findByUserId(userId)
            .orElseGet(() -> {
                NotificationSettings s = new NotificationSettings();
                s.setUserId(userId);
                return s;
            });
        existing.setDisableAll(incoming.isDisableAll());
        existing.setBookingEnabled(incoming.isBookingEnabled());
        existing.setTicketEnabled(incoming.isTicketEnabled());
        existing.setCommentEnabled(incoming.isCommentEnabled());
        return notificationSettingsRepository.save(existing);
    }

    // Get unread count for a user
    public long getUnreadCount(String userId) {
        return notificationRepository
            .findByUserIdAndIsRead(userId, false).size();
    }
}