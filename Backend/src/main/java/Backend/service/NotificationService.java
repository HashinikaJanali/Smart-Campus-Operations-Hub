package Backend.service;

import Backend.model.Notification;
import Backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Get all notifications for a user
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository
            .findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Create a new notification
    public Notification createNotification(String userId, 
                                           String type, 
                                           String message) {
        Notification notification = 
            new Notification(userId, type, message);
        return notificationRepository.save(notification);
    }

    // Mark one notification as read
    public Notification markAsRead(String notificationId) {
        Notification notification = notificationRepository
            .findById(notificationId)
            .orElseThrow(() -> 
                new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    // Mark all notifications as read for a user
    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository
            .findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    // Delete a notification
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}