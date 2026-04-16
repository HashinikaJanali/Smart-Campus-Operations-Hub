package Backend.service;

import Backend.model.TicketModel;
import Backend.repository.TicketRepository;
import Backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NotificationService notificationService;

    private final String UPLOAD_DIR = "uploads/tickets/";

    public List<TicketModel> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<TicketModel> getMyTickets(String userId) {
        if (userId != null && !userId.isBlank()) {
            return ticketRepository.findByUserId(userId);
        }
        return List.of();
    }

    public TicketModel getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public TicketModel createTicket(String resource, String location, String category,
            String description, String priority,
            String submittedBy, String userId,
            String contactPhone, String contactEmail,
            List<MultipartFile> images) throws IOException {

        List<String> imageUrls = new ArrayList<>();
        if (images != null) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
                    Path uploadPath = Paths.get(UPLOAD_DIR);
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }
                    Path filePath = uploadPath.resolve(filename);
                    Files.write(filePath, image.getBytes());
                    imageUrls.add("/uploads/tickets/" + filename);
                }
            }
        }

        TicketModel ticket = new TicketModel();
        ticket.setResource(resource);
        ticket.setLocation(location);
        ticket.setCategory(category);
        ticket.setDescription(description);
        ticket.setPriority(priority != null ? priority : "MEDIUM");
        ticket.setStatus("OPEN");
        ticket.setSubmittedBy(submittedBy);
        ticket.setUserId(userId);
        ticket.setContactPhone(contactPhone);
        ticket.setContactEmail(contactEmail);
        ticket.setImageUrls(imageUrls);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    public TicketModel updateTicketStatus(String id, Map<String, String> payload) {
        TicketModel ticket = getTicketById(id);
        String oldStatus = ticket.getStatus();

        String newStatus = payload.get("status");
        if (newStatus != null)
            ticket.setStatus(newStatus);

        String resolutionNotes = payload.get("resolutionNotes");
        if (resolutionNotes != null)
            ticket.setResolutionNotes(resolutionNotes);

        String rejectionReason = payload.get("rejectionReason");
        if (rejectionReason != null)
            ticket.setRejectionReason(rejectionReason);

        ticket.setUpdatedAt(LocalDateTime.now());
        TicketModel saved = ticketRepository.save(ticket);

        // Notify the ticket owner if the status actually changed
        String ticketOwnerUserId = saved.getUserId();
        if (ticketOwnerUserId != null && !ticketOwnerUserId.isBlank()
                && newStatus != null && !newStatus.equals(oldStatus)) {
            String message = buildStatusChangeMessage(saved, newStatus);
            notificationService.createNotification(ticketOwnerUserId, "TICKET_STATUS_CHANGED", message);
        }

        return saved;
    }

    public TicketModel assignTicket(String id, String technicianName) {
        TicketModel ticket = getTicketById(id);
        ticket.setAssignedTo(technicianName);
        ticket.setStatus("IN_PROGRESS");
        ticket.setUpdatedAt(LocalDateTime.now());
        TicketModel saved = ticketRepository.save(ticket);

        // Notify the ticket owner that work has started
        String ticketOwnerUserId = saved.getUserId();
        if (ticketOwnerUserId != null && !ticketOwnerUserId.isBlank()) {
            String message = String.format(
                "Your ticket \"%s\" has been assigned to %s and is now in progress.",
                truncate(saved.getResource(), 40), technicianName);
            notificationService.createNotification(ticketOwnerUserId, "TICKET_STATUS_CHANGED", message);
        }

        return saved;
    }

    public void deleteTicket(String id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found with id: " + id);
        }
        commentRepository.deleteByTicketId(id);
        ticketRepository.deleteById(id);
    }

    // -----------------------------------------------------------------------
    private String buildStatusChangeMessage(TicketModel ticket, String newStatus) {
        String resource = truncate(ticket.getResource(), 40);
        return switch (newStatus.toUpperCase()) {
            case "IN_PROGRESS" -> String.format("Your ticket \"%s\" is now being worked on.", resource);
            case "RESOLVED"    -> String.format("Your ticket \"%s\" has been resolved.", resource);
            case "CLOSED"      -> String.format("Your ticket \"%s\" has been closed.", resource);
            case "REJECTED"    -> String.format("Your ticket \"%s\" was rejected. Reason: %s",
                    resource,
                    ticket.getRejectionReason() != null ? ticket.getRejectionReason() : "No reason provided.");
            default            -> String.format("Your ticket \"%s\" status changed to %s.", resource, newStatus);
        };
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max) + "…";
    }
}
