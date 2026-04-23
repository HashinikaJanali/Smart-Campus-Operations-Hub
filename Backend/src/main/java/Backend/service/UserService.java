package Backend.service;

import Backend.model.User;
import Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final List<String> VALID_ROLES =
            List.of("USER", "ADMIN", "TECHNICIAN");

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateRole(String userId, String newRole) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }
        if (!VALID_ROLES.contains(newRole)) {
            throw new IllegalArgumentException("Invalid role: " + newRole);
        }
        Optional<User> found = userRepository.findById(userId);
        if (found.isEmpty()) {
            throw new RuntimeException("User not found: " + userId);
        }
        User user = found.get();
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public void deleteUser(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID must not be null");
        }
        Optional<User> found = userRepository.findById(userId);
        if (found.isEmpty()) {
            throw new RuntimeException("User not found: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
