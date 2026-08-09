package tn.tawiniya.tounisiya.repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.TrainingCenter;
import tn.tawiniya.tounisiya.entity.User;
import java.util.List;
public interface TrainingCenterRepository extends JpaRepository<TrainingCenter, Long> {
    /** Utilisé côté public/admin : tous les centres, triés par date de création décroissante. */
    Page<TrainingCenter> findAllByOrderByCreatedAtDesc(Pageable pageable);
    /** Utilisé côté "mes centres" : les centres appartenant à l'utilisateur connecté. */
    List<TrainingCenter> findByOwnerOrderByCreatedAtDesc(User owner);
}