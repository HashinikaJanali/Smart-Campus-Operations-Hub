package Backend.service;

import Backend.model.CommentModel;
import Backend.repository.CommentRepository;
import Backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationService notificationService;

    public List<CommentModel> getCommentsByTicketId(String ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    public CommentModel addComment(String ticketId, String authorName, String text) {
        CommentModel comment = new CommentModel();
        comment.setTicketId(ticketId);
        comment.setAuthorName(authorName);
        comment.setText(text);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        CommentModel saved = commentRepository.save(comment);

        // Notify the ticket owner — skip if the commenter is the owner
        ticketRepository.findById(ticketId).ifPresent(ticket -> {
            String ownerUserId = ticket.getUserId();
            if (ownerUserId != null && !ownerUserId.isBlank()) {
                String msg = String.format(
                    "New comment on your ticket \"%s\": \"%s\"",
                    truncate(ticket.getResource(), 40),
                    truncate(text, 80));
                notificationService.createNotification(ownerUserId, "NEW_COMMENT", msg);
            }
        });

        return saved;
    }

    public CommentModel editComment(String commentId, String requestingUser, String newText) {
        CommentModel comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        if (!comment.getAuthorName().equals(requestingUser)) {
            throw new RuntimeException("You can only edit your own comments.");
        }

        comment.setText(newText);
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String requestingUser) {
        CommentModel comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        if (!comment.getAuthorName().equals(requestingUser)) {
            throw new RuntimeException("You can only delete your own comments.");
        }

        commentRepository.deleteById(commentId);
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max) + "…";
    }
}
