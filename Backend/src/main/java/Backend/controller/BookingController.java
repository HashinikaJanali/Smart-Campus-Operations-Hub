package Backend.controller;

import Backend.model.BookingModel;
import Backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*") // Enable CORS for development
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<BookingModel> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/user/{userId}")
    public List<BookingModel> getBookingsByUser(@PathVariable String userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingModel bookingModel) {
        try {
            BookingModel created = bookingService.createBooking(bookingModel);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create booking.");
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            String reason = payload.get("reason");
            BookingModel updated = bookingService.updateBookingStatus(id, status, reason);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String id, @RequestParam(required = false) String userId) {
        try {
            BookingModel cancelled = bookingService.cancelBooking(id, userId);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/checkin")
    public ResponseEntity<?> checkInBooking(@PathVariable String id) {
        try {
            BookingModel updated = bookingService.checkIn(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
