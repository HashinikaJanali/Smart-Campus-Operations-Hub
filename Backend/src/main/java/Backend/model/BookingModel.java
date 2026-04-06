package Backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bookings")
public class BookingModel {

    @Id
    private String id;

    private String resourceId;
    private String resourceName;
    private String userId;

    private String bookingDate; // YYYY-MM-DD
    private String startTime; // HH:MM (24-hour format)
    private String endTime; // HH:MM (24-hour format)

    private String purpose;
    private int attendees;

    private String status; // PENDING, APPROVED, REJECTED, CANCELLED
    private String adminReason; // Populated if admin accepts/rejects with a reason

    public BookingModel() {
    }

    public BookingModel(String id, String resourceId, String resourceName, String userId, String bookingDate,
            String startTime, String endTime, String purpose, int attendees,
            String status, String adminReason) {
        this.id = id;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.userId = userId;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.attendees = attendees;
        this.status = status;
        this.adminReason = adminReason;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getResourceId() {
        return resourceId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getUserId() {
        return userId;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public int getAttendees() {
        return attendees;
    }

    public String getStatus() {
        return status;
    }

    public String getAdminReason() {
        return adminReason;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public void setAttendees(int attendees) {
        this.attendees = attendees;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAdminReason(String adminReason) {
        this.adminReason = adminReason;
    }
}
