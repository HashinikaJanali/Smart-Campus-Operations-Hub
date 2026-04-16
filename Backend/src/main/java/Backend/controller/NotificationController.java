package Backend.controller;

import Backend.model.Notification;
import Backend.model.User;
import Backend.repository.UserRepository;
import Backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000",
             allowCredentials = "true")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    // Helper to get current user from session
    private Optional<User> getCurrentUser(OAuth2User principal) {
        if (principal == null) return Optional.empty();
        String googleId = principal.getAttribute("sub");
        return userRepository.findByGoogleId(googleId);
    }

    // GET all notifications for logged in user
    @GetMapping
    public ResponseEntity<?> getMyNotifications(
            @AuthenticationPrincipal OAuth2User principal) {
        Optional<User> userOpt = getCurrentUser(principal);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                .body("Not authenticated");
        }
        List<Notification> notifications = notificationService
            .getNotificationsForUser(userOpt.get().getId());
        return ResponseEntity.ok(notifications);
    }

    // PATCH mark one notification as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401)
                .body("Not authenticated");
        }
        try {
            Notification notification = 
                notificationService.markAsRead(id);
            return ResponseEntity.ok(notification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PATCH mark all notifications as read
    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(
            @AuthenticationPrincipal OAuth2User principal) {
        Optional<User> userOpt = getCurrentUser(principal);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                .body("Not authenticated");
        }
        notificationService.markAllAsRead(userOpt.get().getId());
        return ResponseEntity.ok("All notifications marked as read");
    }

    // DELETE a notification
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401)
                .body("Not authenticated");
        }
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok("Notification deleted");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // POST create a test notification (for testing purposes)
    @PostMapping("/test")
    public ResponseEntity<?> createTestNotification(
            @AuthenticationPrincipal OAuth2User principal) {
        Optional<User> userOpt = getCurrentUser(principal);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                .body("Not authenticated");
        }
        Notification notification = notificationService
            .createNotification(
                userOpt.get().getId(),
                "BOOKING_APPROVED",
                "Your booking has been approved!"
            );
        return ResponseEntity.ok(notification);
    }

    // GET debug endpoint to see current user ID
    @GetMapping("/debug/current-user")
    public ResponseEntity<?> getCurrentUserInfo(
            @AuthenticationPrincipal OAuth2User principal) {
        Optional<User> userOpt = getCurrentUser(principal);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                .body("Not authenticated");
        }
        User user = userOpt.get();
        return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
            put("mongodbId", user.getId());
            put("googleId", user.getGoogleId());
            put("name", user.getName());
            put("email", user.getEmail());
            put("role", user.getRole());
        }});
    }
}