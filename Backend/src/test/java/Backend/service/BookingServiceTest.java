package Backend.service;

import Backend.model.BookingModel;
import Backend.model.ResourceModel;
import Backend.model.User;
import Backend.repository.BookingRepository;
import Backend.repository.ResourceRepository;
import Backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /**
     * Test case to verify successful booking creation.
     * Scenario: A valid booking request with no scheduling conflicts and sufficient resource capacity.
     * Expected: The booking should be saved with a 'PENDING' status and resource details populated.
     */
    @Test
    void createBooking_Success() {
        BookingModel booking = new BookingModel();
        booking.setResourceId("res1");
        booking.setBookingDate("2026-05-01");
        booking.setStartTime("10:00");
        booking.setEndTime("11:00");
        booking.setAttendees(10);

        ResourceModel resource = new ResourceModel();
        resource.setId("res1");
        resource.setCapacity(20);
        resource.setStatus("ACTIVE");
        resource.setName("Lecture Hall A");

        when(bookingRepository.findByResourceIdAndBookingDateAndStatusIn(anyString(), anyString(), anyList()))
                .thenReturn(Collections.emptyList());
        when(resourceRepository.findById("res1")).thenReturn(Optional.of(resource));
        when(bookingRepository.save(any(BookingModel.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingModel result = bookingService.createBooking(booking);

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        assertEquals("Lecture Hall A", result.getResourceName());
        verify(bookingRepository).save(booking);
    }

    /**
     * Test case to verify scheduling conflict detection.
     * Scenario: A new booking request overlaps with an existing APPROVED or PENDING booking for the same resource.
     * Expected: A RuntimeException should be thrown containing the message 'Scheduling conflict'.
     */
    @Test
    void createBooking_Conflict() {
        BookingModel newBooking = new BookingModel();
        newBooking.setResourceId("res1");
        newBooking.setBookingDate("2026-05-01");
        newBooking.setStartTime("10:30");
        newBooking.setEndTime("11:30");

        BookingModel existingBooking = new BookingModel();
        existingBooking.setStartTime("10:00");
        existingBooking.setEndTime("11:00");

        when(bookingRepository.findByResourceIdAndBookingDateAndStatusIn(eq("res1"), eq("2026-05-01"), anyList()))
                .thenReturn(Collections.singletonList(existingBooking));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> bookingService.createBooking(newBooking));
        assertTrue(exception.getMessage().contains("Scheduling conflict"));
    }

    /**
     * Test case to verify resource capacity validation.
     * Scenario: The number of attendees in the booking request exceeds the maximum capacity of the selected resource.
     * Expected: A RuntimeException should be thrown containing the message 'Capacity exceeded'.
     */
    @Test
    void createBooking_CapacityExceeded() {
        BookingModel booking = new BookingModel();
        booking.setResourceId("res1");
        booking.setAttendees(50);
        booking.setBookingDate("2026-05-01");
        booking.setStartTime("10:00");
        booking.setEndTime("11:00");

        ResourceModel resource = new ResourceModel();
        resource.setCapacity(30);
        resource.setStatus("ACTIVE");

        when(bookingRepository.findByResourceIdAndBookingDateAndStatusIn(anyString(), anyString(), anyList()))
                .thenReturn(Collections.emptyList());
        when(resourceRepository.findById("res1")).thenReturn(Optional.of(resource));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> bookingService.createBooking(booking));
        assertTrue(exception.getMessage().contains("Capacity exceeded"));
    }

    /**
     * Test case to verify resource availability status validation.
     * Scenario: The selected resource is not 'ACTIVE' (e.g., under maintenance).
     * Expected: A RuntimeException should be thrown containing the message 'Resource is unavailable'.
     */
    @Test
    void createBooking_ResourceInactive() {
        BookingModel booking = new BookingModel();
        booking.setResourceId("res1");
        booking.setBookingDate("2026-05-01");
        booking.setStartTime("10:00");
        booking.setEndTime("11:00");

        ResourceModel resource = new ResourceModel();
        resource.setStatus("MAINTENANCE");

        when(bookingRepository.findByResourceIdAndBookingDateAndStatusIn(anyString(), anyString(), anyList()))
                .thenReturn(Collections.emptyList());
        when(resourceRepository.findById("res1")).thenReturn(Optional.of(resource));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> bookingService.createBooking(booking));
        assertTrue(exception.getMessage().contains("Resource is unavailable"));
    }

    /**
     * Test case to verify booking status update (Approval).
     * Scenario: An administrator approves a PENDING booking.
     * Expected: The booking status updates to 'APPROVED' and a notification is sent to the user.
     */
    @Test
    void updateBookingStatus_Approved() {
        BookingModel booking = new BookingModel();
        booking.setId("book1");
        booking.setStatus("PENDING");
        booking.setUserId("user1");

        when(bookingRepository.findById("book1")).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(BookingModel.class))).thenReturn(booking);

        BookingModel result = bookingService.updateBookingStatus("book1", "APPROVED", "Looks good");

        assertEquals("APPROVED", result.getStatus());
        assertEquals("Looks good", result.getAdminReason());
        verify(notificationService).createNotification(eq("user1"), eq("BOOKING_APPROVED"), anyString());
    }

    /**
     * Test case to verify digital check-in functionality.
     * Scenario: A user checks into an APPROVED booking.
     * Expected: The 'checkedIn' flag becomes true and a check-in timestamp is recorded.
     */
    @Test
    void checkIn_Success() {
        BookingModel booking = new BookingModel();
        booking.setId("book1");
        booking.setStatus("APPROVED");
        booking.setCheckedIn(false);

        when(bookingRepository.findById("book1")).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(BookingModel.class))).thenReturn(booking);

        BookingModel result = bookingService.checkIn("book1");

        assertTrue(result.isCheckedIn());
        assertNotNull(result.getCheckInTime());
    }

    /**
     * Test case to verify authorization for booking cancellation.
     * Scenario: A user attempts to cancel a booking that belongs to a different user.
     * Expected: A RuntimeException should be thrown containing the message 'Unauthorized'.
     */
    @Test
    void cancelBooking_Unauthorized() {
        BookingModel booking = new BookingModel();
        booking.setUserId("user1");

        when(bookingRepository.findById("book1")).thenReturn(Optional.of(booking));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> bookingService.cancelBooking("book1", "user2"));
        assertTrue(exception.getMessage().contains("Unauthorized"));
    }

    /**
     * Test case to verify state validation for cancellation.
     * Scenario: Attempting to cancel a booking that has already been CANCELLED or REJECTED.
     * Expected: A RuntimeException should be thrown indicating the booking is already in that state.
     */
    @Test
    void cancelBooking_AlreadyCancelled() {
        BookingModel booking = new BookingModel();
        booking.setUserId("user1");
        booking.setStatus("CANCELLED");

        when(bookingRepository.findById("book1")).thenReturn(Optional.of(booking));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> bookingService.cancelBooking("book1", "user1"));
        assertTrue(exception.getMessage().contains("already CANCELLED"));
    }

    /**
     * Test case to verify existence check before deletion.
     * Scenario: Attempting to delete a booking using an ID that does not exist in the database.
     * Expected: A RuntimeException should be thrown containing the message 'Booking not found'.
     */
    @Test
    void deleteBooking_NotFound() {
        when(bookingRepository.existsById("nonexistent")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> bookingService.deleteBooking("nonexistent"));
        assertTrue(exception.getMessage().contains("Booking not found"));
    }

    /**
     * Test case to verify dynamic user name enrichment.
     * Scenario: Retrieving bookings where user names are missing from the booking record.
     * Expected: The service should fetch the names from the UserRepository and populate the model.
     */
    @Test
    void getAllBookings_PopulateUserNames() {
        BookingModel booking = new BookingModel();
        booking.setUserId("user1");
        booking.setUserName("");

        User user = new User();
        user.setName("John Doe");

        when(bookingRepository.findAll()).thenReturn(Arrays.asList(booking));
        when(userRepository.findById("user1")).thenReturn(Optional.of(user));

        List<BookingModel> results = bookingService.getAllBookings();

        assertEquals("John Doe", results.get(0).getUserName());
    }
}
