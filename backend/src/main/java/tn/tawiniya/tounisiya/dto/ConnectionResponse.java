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
public class ConnectionResponse {
    private Long id;
    private UserCardResponse otherUser;
    private String status;
    private LocalDateTime createdAt;
    // true si l'utilisateur courant est celui qui a envoyé la demande
    private boolean sentByMe;
}