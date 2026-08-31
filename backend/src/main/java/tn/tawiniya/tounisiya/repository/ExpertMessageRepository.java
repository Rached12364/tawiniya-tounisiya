package tn.tawiniya.tounisiya.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.tawiniya.tounisiya.entity.ExpertMessage;
import java.util.List;
public interface ExpertMessageRepository extends JpaRepository<ExpertMessage, Long> {
    List<ExpertMessage> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
    ExpertMessage findFirstByConversationIdOrderByCreatedAtDesc(Long conversationId);
}