package Backend.controller;

import Backend.model.BookingModel;
import Backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

//Controller managing REST API endpoints for Bookings.

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // GET /api/bookings - Retrieve all bookings

    @GetMapping
    public ResponseEntity<List<BookingModel>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET /api/bookings/user/{userId} - Retrieve bookings for a specific user

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingModel>> getBookingsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    // POST /api/bookings - Create a new booking
    // Uses 201 Created status code for successful creation

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingModel bookingModel) {
        try {
            BookingModel created = bookingService.createBooking(bookingModel);
            return ResponseEntity.status(HttpStatus.CREATED).body(created); // 201 Created
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage())); // 409
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Failed to create booking.")); // 400
        }
    }

    // PUT /api/bookings/{id}/status - Update booking status

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        try {
            String status = payload.get("status");
            String reason = payload.get("reason");
            BookingModel updated = bookingService.updateBookingStatus(id, status, reason);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/bookings/{id}/cancel - Cancel a booking

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String id, @RequestParam(required = false) String userId) {
        try {
            BookingModel cancelled = bookingService.cancelBooking(id, userId);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/bookings/{id}/checkin - Check-in for an existing booking

    @PostMapping("/{id}/checkin")
    public ResponseEntity<?> checkInBooking(@PathVariable String id) {
        try {
            BookingModel updated = bookingService.checkIn(id);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/bookings/{id} - Delete a booking

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable String id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok(Map.of("message", "Booking deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
