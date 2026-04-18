package Backend.service;

import Backend.model.BookingModel;
import Backend.model.ResourceModel;
import Backend.repository.BookingRepository;
import Backend.repository.ResourceRepository;
import Backend.repository.UserRepository;
import Backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public List<BookingModel> getAllBookings() {
        List<BookingModel> bookings = bookingRepository.findAll();
        return populateUserNames(bookings);
    }

    public List<BookingModel> getBookingsByUserId(String userId) {
        List<BookingModel> bookings = bookingRepository.findByUserId(userId);
        return populateUserNames(bookings);
    }

    private List<BookingModel> populateUserNames(List<BookingModel> bookings) {
        for (BookingModel booking : bookings) {
            if (booking.getUserName() == null || booking.getUserName().trim().isEmpty()) {
                if (booking.getUserId() != null && !booking.getUserId().trim().isEmpty()) {
                    Optional<User> userOpt = userRepository.findById(booking.getUserId());
                    if (userOpt.isPresent() && userOpt.get().getName() != null) {
                        booking.setUserName(userOpt.get().getName());
                    } else {
                        booking.setUserName("Unknown User");
                    }
                } else {
                    booking.setUserName("Unknown User");
                }
            }
        }
        return bookings;
    }

    public BookingModel createBooking(BookingModel booking) {
        // ------------------------------------------------------------------
        // Scheduling conflict check (done in Java for reliability)
        // Two bookings [A,B] and [C,D] overlap when: A < D AND C < B
        // Times are stored as HH:MM (24h, zero-padded) so String.compareTo
        // gives correct lexicographic ordering.
        // ------------------------------------------------------------------
        List<BookingModel> activeBookings = bookingRepository
                .findByResourceIdAndBookingDateAndStatusIn(
                        booking.getResourceId(),
                        booking.getBookingDate(),
                        java.util.Arrays.asList("PENDING", "APPROVED"));

        boolean hasConflict = activeBookings.stream()
                .anyMatch(existing -> existing.getStartTime().compareTo(booking.getEndTime()) < 0
                        && existing.getEndTime().compareTo(booking.getStartTime()) > 0);

        if (hasConflict) {
            throw new RuntimeException(
                    "Scheduling conflict: This resource is already booked during the requested time period.");
        }

        // Validate resource capacity if attendees specified
        Optional<ResourceModel> resOpt = resourceRepository.findById(booking.getResourceId());
        if (resOpt.isPresent()) {
            ResourceModel currentResource = resOpt.get();
            booking.setResourceName(currentResource.getName()); // Keep denormalized copy
            booking.setResourceType(currentResource.getType());
            if (booking.getAttendees() > currentResource.getCapacity() && currentResource.getCapacity() > 0) {
                throw new RuntimeException(
                        "Capacity exceeded: Selected resource has max capacity of " + currentResource.getCapacity());
            }
            if (!"ACTIVE".equals(currentResource.getStatus())) {
                throw new RuntimeException("Resource is unavailable: Currently OUT_OF_SERVICE.");
            }
        } else {
            throw new RuntimeException("Resource not found.");
        }

        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public BookingModel updateBookingStatus(String id, String status, String reason) {
        Optional<BookingModel> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            BookingModel booking = bookingOpt.get();

            // Validate allowed status transitions
            if ("CANCELLED".equals(booking.getStatus()) || "REJECTED".equals(booking.getStatus())) {
                throw new RuntimeException("Cannot update status of a " + booking.getStatus() + " booking.");
            }

            booking.setStatus(status.toUpperCase());
            booking.setAdminReason(reason);
            BookingModel saved = bookingRepository.save(booking);

            // Notify the booking owner on approval or rejection
            String userId = saved.getUserId();
            if (userId != null && !userId.isBlank()) {
                String upperStatus = status.toUpperCase();
                if ("APPROVED".equals(upperStatus)) {
                    String msg = String.format(
                            "Your booking for \"%s\" on %s (%s–%s) has been approved.",
                            saved.getResourceName(), saved.getBookingDate(),
                            saved.getStartTime(), saved.getEndTime());
                    notificationService.createNotification(userId, "BOOKING_APPROVED", msg);
                } else if ("REJECTED".equals(upperStatus)) {
                    String msg = String.format(
                            "Your booking for \"%s\" on %s has been rejected.%s",
                            saved.getResourceName(), saved.getBookingDate(),
                            reason != null && !reason.isBlank() ? " Reason: " + reason : "");
                    notificationService.createNotification(userId, "BOOKING_REJECTED", msg);
                }
            }

            return saved;
        }
        throw new RuntimeException("Booking not found");
    }

    public BookingModel cancelBooking(String id, String userId) {
        Optional<BookingModel> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            BookingModel booking = bookingOpt.get();

            // Admin can cancel anything or User can cancel their own
            if (userId != null && !booking.getUserId().equals(userId) && !userId.equals("ADMIN")) {
                throw new RuntimeException("Unauthorized to cancel this booking.");
            }

            if ("CANCELLED".equals(booking.getStatus()) || "REJECTED".equals(booking.getStatus())) {
                throw new RuntimeException("Booking is already " + booking.getStatus());
            }

            booking.setStatus("CANCELLED");
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found");
    }

    public BookingModel checkIn(String id) {
        Optional<BookingModel> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            BookingModel booking = bookingOpt.get();

            if (!"APPROVED".equals(booking.getStatus())) {
                throw new RuntimeException(
                        "Only approved bookings can be checked in. Current status: " + booking.getStatus());
            }

            if (booking.isCheckedIn()) {
                throw new RuntimeException("Booking is already checked in.");
            }

            booking.setCheckedIn(true);
            booking.setCheckInTime(java.time.LocalDateTime.now().toString());
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found");
    }
}
