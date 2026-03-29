package Backend.repository;

import Backend.model.ResourceModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository
        extends JpaRepository<ResourceModel, Long> {

    List<ResourceModel> findByType(String type);
    List<ResourceModel> findByStatus(String status);
    List<ResourceModel> findByLocation(String location);
    List<ResourceModel> findByTypeAndStatus(String type, String status);
}