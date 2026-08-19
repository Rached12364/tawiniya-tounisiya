package tn.tawiniya.tounisiya.dto;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tn.tawiniya.tounisiya.entity.ReactionType;
@Data
public class ReactionRequest {
    @NotNull(message = "Le type de réaction est obligatoire")
    private ReactionType type;
}