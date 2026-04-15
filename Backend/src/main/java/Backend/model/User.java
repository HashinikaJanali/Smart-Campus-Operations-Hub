package Backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String googleId;
    private String name;
    private String email;
    private String profilePicture;
    private String role;
    private LocalDateTime createdAt;

    public User(String googleId, String name,
                String email, String profilePicture) {
        this.googleId = googleId;
        this.name = name;
        this.email = email;
        this.profilePicture = profilePicture;
        this.role = "USER";
        this.createdAt = LocalDateTime.now();
    }
}