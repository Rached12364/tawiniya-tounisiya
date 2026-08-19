package tn.tawiniya.tounisiya.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class PostRequest {
    @NotBlank(message = "Le contenu du post est obligatoire")
    private String content;
}