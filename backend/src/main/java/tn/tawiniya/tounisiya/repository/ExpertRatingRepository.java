package tn.tawiniya.tounisiya.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.tawiniya.tounisiya.entity.ExpertRating;
import java.util.List;
import java.util.Optional;
public interface ExpertRatingRepository extends JpaRepository<ExpertRating, Long> {
    Optional<ExpertRating> findByExpertIdAndAuthorId(Long expertId, Long authorId);
    List<ExpertRating> findByExpertIdOrderByCreatedAtDesc(Long expertId);
    @Query("SELECT AVG(r.rating) FROM ExpertRating r WHERE r.expert.id = :expertId")
    Double averageForExpert(@Param("expertId") Long expertId);
    long countByExpertId(Long expertId);
}