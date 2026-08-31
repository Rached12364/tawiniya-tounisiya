package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertMessageResponse {
    private Long id;
    private Long senderId;
    private String senderNom;
    private String senderPrenom;
    private String content;
    private String attachmentPath;
    private LocalDateTime createdAt;
    private boolean mine;
}