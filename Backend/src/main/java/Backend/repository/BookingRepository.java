package Backend.repository;

import Backend.model.BookingModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingModel, Long> {
    
    List<BookingModel> findByUserId(String userId);

    @Query("SELECT b FROM BookingModel b WHERE b.resourceId = :resourceId AND b.bookingDate = :bookingDate AND b.status IN ('PENDING', 'APPROVED') AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<BookingModel> findOverlappingBookings(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") String bookingDate,
            @Param("startTime") String startTime,
            @Param("endTime") String endTime
    );
}
