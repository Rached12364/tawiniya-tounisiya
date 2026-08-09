package tn.tawiniya.tounisiya.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tn.tawiniya.tounisiya.entity.ReclamationStatus;

@Data
public class ReclamationStatusUpdateRequest {

    @NotNull(message = "Le statut est obligatoire")
    private ReclamationStatus status;

    private String adminResponse;
}
