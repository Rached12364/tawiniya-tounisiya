package tn.tawiniya.tounisiya.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CommentRequest {
    @NotBlank(message = "Le commentaire ne peut pas etre vide")
    private String content;
    private Long parentCommentId;
}