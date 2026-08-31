package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.ConversationStatus;
import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertConversationSummaryResponse {
    private Long id;
    private String subject;
    private ConversationStatus status;
    private LocalDateTime updatedAt;
    private ConversationParticipant otherUser;
    private String lastMessagePreview;
    private boolean isExpertSide;
}