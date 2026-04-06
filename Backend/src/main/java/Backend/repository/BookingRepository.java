package Backend.repository;

import Backend.model.BookingModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<BookingModel, String> {
    
    List<BookingModel> findByUserId(String userId);

    @Query("{'resourceId': ?0, 'bookingDate': ?3, 'status': { $in: ['PENDING', 'APPROVED'] }, $or: [ { 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } } ] }")
    List<BookingModel> findOverlappingBookings(
            String resourceId,
            String startTime,
            String endTime,
            String bookingDate
    );
}
