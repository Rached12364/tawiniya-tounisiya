package tn.tawiniya.tounisiya.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import tn.tawiniya.tounisiya.entity.ReclamationType;

@Data
public class ReclamationRequest {

    @NotNull(message = "Le type de réclamation est obligatoire")
    private ReclamationType type;

    @NotBlank(message = "L'objet est obligatoire")
    @Size(max = 150, message = "L'objet ne doit pas dépasser 150 caractères")
    private String subject;

    @NotBlank(message = "La description est obligatoire")
    @Size(max = 3000, message = "La description ne doit pas dépasser 3000 caractères")
    private String description;
}
