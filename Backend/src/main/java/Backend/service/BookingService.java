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
        // Validate timeframe overlap
        List<BookingModel> overlaps = bookingRepository.findOverlappingBookings(
                booking.getResourceId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!overlaps.isEmpty()) {
            throw new RuntimeException("Scheduling conflict: The resource is already booked during this time range.");
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

    public BookingModel updateBookingStatus(Long id, String status, String reason) {
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

    public BookingModel cancelBooking(Long id, String userId) {
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
