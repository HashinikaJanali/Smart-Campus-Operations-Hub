package Backend.repository;

import Backend.model.TicketModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<TicketModel, String> {

    List<TicketModel> findByUserId(String userId);
    List<TicketModel> findBySubmittedBy(String submittedBy);
    List<TicketModel> findByAssignedTo(String assignedTo);
    List<TicketModel> findByStatus(String status);
    List<TicketModel> findByPriority(String priority);
}