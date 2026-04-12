package Backend.repository;

import Backend.model.CommentModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<CommentModel, String> {

    List<CommentModel> findByTicketId(String ticketId);
    void deleteByTicketId(String ticketId);
}