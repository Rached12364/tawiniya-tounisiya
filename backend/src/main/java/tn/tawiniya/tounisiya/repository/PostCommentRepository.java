package tn.tawiniya.tounisiya.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.PostComment;
import java.util.List;
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    List<PostComment> findByPostIdAndParentCommentIsNullOrderByCreatedAtAsc(Long postId);
    List<PostComment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);
    long countByPostId(Long postId);
}