package Backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notification_settings")
public class NotificationSettings {

    @Id
    private String id;
    private String userId;
    private boolean disableAll;
    private boolean bookingEnabled;
    private boolean ticketEnabled;
    private boolean commentEnabled;

    public NotificationSettings() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public boolean isDisableAll() { return disableAll; }
    public void setDisableAll(boolean disableAll) { this.disableAll = disableAll; }

    public boolean isBookingEnabled() { return bookingEnabled; }
    public void setBookingEnabled(boolean bookingEnabled) { this.bookingEnabled = bookingEnabled; }

    public boolean isTicketEnabled() { return ticketEnabled; }
    public void setTicketEnabled(boolean ticketEnabled) { this.ticketEnabled = ticketEnabled; }

    public boolean isCommentEnabled() { return commentEnabled; }
    public void setCommentEnabled(boolean commentEnabled) { this.commentEnabled = commentEnabled; }
}
