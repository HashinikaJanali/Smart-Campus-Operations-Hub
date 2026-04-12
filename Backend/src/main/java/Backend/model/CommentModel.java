package Backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "ticket_comments")
public class CommentModel {

    @Id
    private String id;

    private String ticketId;
    private String authorName;
    private String text;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentModel() {}

    public CommentModel(String id, String ticketId, String authorName,
                        String text, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.ticketId = ticketId;
        this.authorName = authorName;
        this.text = text;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public String getTicketId() { return ticketId; }
    public String getAuthorName() { return authorName; }
    public String getText() { return text; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(String id) { this.id = id; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public void setText(String text) { this.text = text; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}