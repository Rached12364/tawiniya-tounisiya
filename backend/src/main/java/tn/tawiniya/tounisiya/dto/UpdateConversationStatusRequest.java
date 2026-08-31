package tn.tawiniya.tounisiya.dto;
import lombok.Data;
import tn.tawiniya.tounisiya.entity.ConversationStatus;
@Data
public class UpdateConversationStatusRequest {
    private ConversationStatus status;
}