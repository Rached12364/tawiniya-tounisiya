package tn.tawiniya.tounisiya.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class ReclamationAnalysisRequest {
    @NotBlank(message = "La description est obligatoire")
    @Size(max = 3000, message = "La description ne doit pas depasser 3000 caracteres")
    private String description;
}