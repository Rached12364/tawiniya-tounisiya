package tn.tawiniya.tounisiya.repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.Event;
import java.time.LocalDate;
public interface EventRepository extends JpaRepository<Event, Long> {
    /** Utilisé côté public : événements à venir uniquement, triés par date croissante. */
    Page<Event> findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate today, Pageable pageable);
    /** Utilisé côté admin : tous les événements, triés par date décroissante. */
    Page<Event> findAllByOrderByEventDateDesc(Pageable pageable);
}