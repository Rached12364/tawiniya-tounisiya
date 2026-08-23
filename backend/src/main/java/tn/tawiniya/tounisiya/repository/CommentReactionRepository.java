package tn.tawiniya.tounisiya.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.CommentReaction;
import java.util.List;
import java.util.Optional;
public interface CommentReactionRepository extends JpaRepository<CommentReaction, Long> {
    Optional<CommentReaction> findByCommentIdAndUserId(Long commentId, Long userId);
    List<CommentReaction> findByCommentId(Long commentId);
}