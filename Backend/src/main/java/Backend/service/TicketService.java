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

    private final String UPLOAD_DIR = "uploads/tickets/";

    public List<TicketModel> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<TicketModel> getMyTickets(String submittedBy) {
        return ticketRepository.findBySubmittedBy(submittedBy);
    }

    public TicketModel getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
    }

    public TicketModel createTicket(String resource, String location, String category,
            String description, String priority,
            String submittedBy, String contactPhone, String contactEmail,
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
        ticket.setContactPhone(contactPhone);
        ticket.setContactEmail(contactEmail);
        ticket.setImageUrls(imageUrls);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return ticketRepository.save(ticket);
    }

    public TicketModel updateTicketStatus(String id, Map<String, String> payload) {
        TicketModel ticket = getTicketById(id);

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
        return ticketRepository.save(ticket);
    }

    public TicketModel assignTicket(String id, String technicianName) {
        TicketModel ticket = getTicketById(id);
        ticket.setAssignedTo(technicianName);
        ticket.setStatus("IN_PROGRESS");
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(String id) {
        if (!ticketRepository.existsById(id)) {
            throw new RuntimeException("Ticket not found with id: " + id);
        }
        commentRepository.deleteByTicketId(id);
        ticketRepository.deleteById(id);
    }
}