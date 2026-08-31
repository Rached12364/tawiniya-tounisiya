package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.ConversationStatus;
import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertConversationDetailResponse {
    private Long id;
    private String subject;
    private ConversationStatus status;
    private ConversationParticipant otherUser;
    private boolean isExpertSide;
    private List<ExpertMessageResponse> messages;
}