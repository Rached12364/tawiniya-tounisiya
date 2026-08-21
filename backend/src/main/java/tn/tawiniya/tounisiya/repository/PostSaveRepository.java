package tn.tawiniya.tounisiya.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.PostSave;
import java.util.List;
import java.util.Optional;
public interface PostSaveRepository extends JpaRepository<PostSave, Long> {
    Optional<PostSave> findByPostIdAndUserId(Long postId, Long userId);
    List<PostSave> findByUserIdOrderByCreatedAtDesc(Long userId);
}