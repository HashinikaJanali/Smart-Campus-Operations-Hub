package Backend.service;

import Backend.model.CommentModel;
import Backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

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
        return commentRepository.save(comment);
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
}