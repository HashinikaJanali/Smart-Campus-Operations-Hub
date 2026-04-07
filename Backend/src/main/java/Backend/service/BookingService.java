package Backend.service;

import Backend.model.BookingModel;
import Backend.model.ResourceModel;
import Backend.repository.BookingRepository;
import Backend.repository.ResourceRepository;
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

    public List<BookingModel> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<BookingModel> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public BookingModel createBooking(BookingModel booking) {
        // ------------------------------------------------------------------
        // Scheduling conflict check (done in Java for reliability)
        // Two bookings [A,B] and [C,D] overlap when: A < D  AND  C < B
        // Times are stored as HH:MM (24h, zero-padded) so String.compareTo
        // gives correct lexicographic ordering.
        // ------------------------------------------------------------------
        List<BookingModel> activeBookings = bookingRepository
                .findByResourceIdAndBookingDateAndStatusIn(
                        booking.getResourceId(),
                        booking.getBookingDate(),
                        java.util.Arrays.asList("PENDING", "APPROVED")
                );

        boolean hasConflict = activeBookings.stream().anyMatch(existing ->
                existing.getStartTime().compareTo(booking.getEndTime()) < 0
                && existing.getEndTime().compareTo(booking.getStartTime()) > 0
        );

        if (hasConflict) {
            throw new RuntimeException(
                "Scheduling conflict: This resource is already booked during the requested time period."
            );
        }

        // Validate resource capacity if attendees specified
        Optional<ResourceModel> resOpt = resourceRepository.findById(booking.getResourceId());
        if(resOpt.isPresent()) {
            ResourceModel currentResource = resOpt.get();
            booking.setResourceName(currentResource.getName()); // Keep denormalized copy
            if (booking.getAttendees() > currentResource.getCapacity() && currentResource.getCapacity() > 0) {
                 throw new RuntimeException("Capacity exceeded: Selected resource has max capacity of " + currentResource.getCapacity());
            }
            if(!"ACTIVE".equals(currentResource.getStatus())) {
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
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found");
    }

    public BookingModel cancelBooking(String id, String userId) {
        Optional<BookingModel> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            BookingModel booking = bookingOpt.get();
            
            // Admin can cancel anything or User can cancel their own
            if(userId != null && !booking.getUserId().equals(userId) && !userId.equals("ADMIN")) {
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
}
