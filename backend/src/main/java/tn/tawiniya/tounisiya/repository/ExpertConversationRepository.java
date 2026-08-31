package tn.tawiniya.tounisiya.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.tawiniya.tounisiya.entity.ExpertConversation;
import java.util.List;
import java.util.Optional;
public interface ExpertConversationRepository extends JpaRepository<ExpertConversation, Long> {
    Optional<ExpertConversation> findByRequesterIdAndExpertId(Long requesterId, Long expertId);
    @Query("SELECT c FROM ExpertConversation c WHERE c.requester.id = :userId OR c.expert.id = :userId ORDER BY c.updatedAt DESC")
    List<ExpertConversation> findAllForUser(@Param("userId") Long userId);
}