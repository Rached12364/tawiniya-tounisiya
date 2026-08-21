package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private PostAuthorDto author;
    private String content;
    private String imagePath;
    private LocalDateTime createdAt;
    private Map<String, Long> reactionsCount;
    private long totalReactions;
    private long totalComments;
    private String myReaction; // null si l'utilisateur courant n'a pas réagi
    private boolean pinned;
    private boolean savedByMe;
    private boolean canEdit; // auteur ou admin
}