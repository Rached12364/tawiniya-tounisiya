package tn.tawiniya.tounisiya.repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.TechnicienProfile;
import tn.tawiniya.tounisiya.entity.User;
import java.util.Optional;
public interface TechnicienProfileRepository extends JpaRepository<TechnicienProfile, Long> {
    Optional<TechnicienProfile> findByUser(User user);
    Optional<TechnicienProfile> findByUserId(Long userId);
    Page<TechnicienProfile> findAllByOrderByCreatedAtDesc(Pageable pageable);
}