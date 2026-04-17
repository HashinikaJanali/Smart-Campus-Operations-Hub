package Backend.controller;

import Backend.model.TicketModel;
import Backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")

public class TicketController {

    @Autowired
    private TicketService ticketService;

    // GET /api/tickets
    @GetMapping
    public ResponseEntity<List<TicketModel>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET /api/tickets/my?userId=xxx
    @GetMapping("/my")
    public ResponseEntity<List<TicketModel>> getMyTickets(
            @RequestParam(required = false) String userId) {
        return ResponseEntity.ok(ticketService.getMyTickets(userId));
    }

    // GET /api/tickets/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ticketService.getTicketById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // POST /api/tickets
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createTicket(
            @RequestParam("resource") String resource,
            @RequestParam("location") String location,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam(value = "priority", defaultValue = "MEDIUM") String priority,
            @RequestParam(value = "submittedBy", defaultValue = "anonymous") String submittedBy,
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam(value = "contactPhone", required = false) String contactPhone,
            @RequestParam(value = "contactEmail", required = false) String contactEmail,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        try {
            TicketModel created = ticketService.createTicket(
                    resource, location, category, description, priority,
                    submittedBy, userId, contactPhone, contactEmail, images);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create ticket: " + e.getMessage());
        }
    }

    // PATCH /api/tickets/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(ticketService.updateTicketStatus(id, payload));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PATCH /api/tickets/{id}/assign
    @PatchMapping("/{id}/assign")
    public ResponseEntity<?> assignTicket(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        try {
            String technicianName = payload.get("assignedTo");
            return ResponseEntity.ok(ticketService.assignTicket(id, technicianName));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/tickets/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable String id) {
        try {
            ticketService.deleteTicket(id);
            return ResponseEntity.ok("Ticket deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
