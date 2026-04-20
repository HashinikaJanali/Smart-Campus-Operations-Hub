package Backend.repository;

import Backend.model.NotificationSettings;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface NotificationSettingsRepository
        extends MongoRepository<NotificationSettings, String> {

    Optional<NotificationSettings> findByUserId(String userId);
}
