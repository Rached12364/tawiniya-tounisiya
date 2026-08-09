package tn.tawiniya.tounisiya.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.Reclamation;
import tn.tawiniya.tounisiya.entity.ReclamationStatus;
import tn.tawiniya.tounisiya.entity.User;

public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {

    Page<Reclamation> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    Page<Reclamation> findByStatusOrderByCreatedAtDesc(ReclamationStatus status, Pageable pageable);

    Page<Reclamation> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
