package Backend.controller;

import Backend.model.CommentModel;
import Backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@CrossOrigin("*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // GET /api/tickets/{ticketId}/comments
    @GetMapping
    public ResponseEntity<List<CommentModel>> getComments(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicketId(ticketId));
    }

    // POST /api/tickets/{ticketId}/comments
    // Body: { "text": "...", "authorName": "..." }
    @PostMapping
    public ResponseEntity<?> addComment(
            @PathVariable String ticketId,
            @RequestBody Map<String, String> payload) {
        try {
            String text = payload.get("text");
            String authorName = payload.getOrDefault("authorName", "anonymous");
            CommentModel comment = commentService.addComment(ticketId, authorName, text);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add comment: " + e.getMessage());
        }
    }

    // PUT /api/tickets/{ticketId}/comments/{commentId}
    // Body: { "text": "...", "requestingUser": "..." }
    @PutMapping("/{commentId}")
    public ResponseEntity<?> editComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestBody Map<String, String> payload) {
        try {
            String newText = payload.get("text");
            String requestingUser = payload.getOrDefault("requestingUser", "anonymous");
            return ResponseEntity.ok(commentService.editComment(commentId, requestingUser, newText));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/tickets/{ticketId}/comments/{commentId}?requestingUser=username
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @RequestParam(defaultValue = "anonymous") String requestingUser) {
        try {
            commentService.deleteComment(commentId, requestingUser);
            return ResponseEntity.ok("Comment deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}