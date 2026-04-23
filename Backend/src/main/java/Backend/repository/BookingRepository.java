package Backend.repository;

import Backend.model.BookingModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<BookingModel, String> {

    List<BookingModel> findByUserId(String userId);

    // Fetch all active bookings for a given resource on a given date.
    // Overlap logic is handled in Java (BookingService) for reliability.
    List<BookingModel> findByResourceIdAndBookingDateAndStatusIn(
            String resourceId,
            String bookingDate,
            java.util.List<String> statuses);
}
