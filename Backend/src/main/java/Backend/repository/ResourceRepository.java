package Backend.repository;

import Backend.model.ResourceModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository
        extends MongoRepository<ResourceModel, String> {

    List<ResourceModel> findByType(String type);
    List<ResourceModel> findByStatus(String status);
    List<ResourceModel> findByLocation(String location);
    List<ResourceModel> findByTypeAndStatus(String type, String status);
}