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
public class ExpertRatingResponse {
    private Long id;
    private Long authorId;
    private String authorNom;
    private String authorPrenom;
    private String authorPhotoProfilPath;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private boolean mine;
}