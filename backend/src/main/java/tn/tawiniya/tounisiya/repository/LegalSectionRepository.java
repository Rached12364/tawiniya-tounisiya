package tn.tawiniya.tounisiya.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.LegalSection;
import java.util.List;
public interface LegalSectionRepository extends JpaRepository<LegalSection, Long> {
    /** Utilisé côté public : sections actives uniquement, triées par ordre d'affichage. */
    List<LegalSection> findByActiveTrueOrderByOrderIndexAsc();
    /** Utilisé côté admin : toutes les sections, triées par ordre d'affichage. */
    List<LegalSection> findAllByOrderByOrderIndexAsc();
}