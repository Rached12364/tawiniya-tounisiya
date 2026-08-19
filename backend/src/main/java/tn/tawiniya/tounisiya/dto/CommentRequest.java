package tn.tawiniya.tounisiya.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CommentRequest {
    @NotBlank(message = "Le commentaire ne peut pas être vide")
    private String content;
}