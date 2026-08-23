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
public class CommentResponse {
    private Long id;
    private PostAuthorDto author;
    private String content;
    private LocalDateTime createdAt;
    private Long parentCommentId;
    private Map<String, Long> reactionsCount;
    private long totalReactions;
    private String myReaction;
    private List<CommentResponse> replies;
}