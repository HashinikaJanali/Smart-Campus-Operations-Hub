package Backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "tickets")
public class TicketModel {

    @Id
    private String id;

    private String resource;
    private String location;
    private String category;
    private String description;
    private String priority;
    private String status;

    private String userId;       // MongoDB User.id of the ticket owner
    private String submittedBy;  // Display name of the submitter
    private String assignedTo;

    private String contactPhone;
    private String contactEmail;

    private List<String> imageUrls = new ArrayList<>();

    private String resolutionNotes;
    private String rejectionReason;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TicketModel() {}

    public TicketModel(String id, String resource, String location, String category,
                       String description, String priority, String status,
                       String submittedBy, String assignedTo,
                       String contactPhone, String contactEmail,
                       List<String> imageUrls, String resolutionNotes, String rejectionReason,
                       LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.resource = resource;
        this.location = location;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.submittedBy = submittedBy;
        this.assignedTo = assignedTo;
        this.contactPhone = contactPhone;
        this.contactEmail = contactEmail;
        this.imageUrls = imageUrls;
        this.resolutionNotes = resolutionNotes;
        this.rejectionReason = rejectionReason;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getResource() { return resource; }
    public String getLocation() { return location; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
    public String getSubmittedBy() { return submittedBy; }
    public String getAssignedTo() { return assignedTo; }
    public String getContactPhone() { return contactPhone; }
    public String getContactEmail() { return contactEmail; }
    public List<String> getImageUrls() { return imageUrls; }
    public String getResolutionNotes() { return resolutionNotes; }
    public String getRejectionReason() { return rejectionReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(String id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setResource(String resource) { this.resource = resource; }
    public void setLocation(String location) { this.location = location; }
    public void setCategory(String category) { this.category = category; }
    public void setDescription(String description) { this.description = description; }
    public void setPriority(String priority) { this.priority = priority; }
    public void setStatus(String status) { this.status = status; }
    public void setSubmittedBy(String submittedBy) { this.submittedBy = submittedBy; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}