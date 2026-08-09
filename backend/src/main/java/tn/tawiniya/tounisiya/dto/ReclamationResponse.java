package tn.tawiniya.tounisiya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.Reclamation;
import tn.tawiniya.tounisiya.entity.ReclamationStatus;
import tn.tawiniya.tounisiya.entity.ReclamationType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReclamationResponse {
    private Long id;
    private ReclamationType type;
    private String subject;
    private String description;
    private String attachmentPath;
    private ReclamationStatus status;
    private String adminResponse;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Infos sur l'auteur (utile côté admin, qui voit toutes les réclamations)
    private Long userId;
    private String userNom;
    private String userPrenom;
    private String userEmail;
    private String userRole;

    public static ReclamationResponse from(Reclamation r) {
        return ReclamationResponse.builder()
                .id(r.getId())
                .type(r.getType())
                .subject(r.getSubject())
                .description(r.getDescription())
                .attachmentPath(r.getAttachmentPath())
                .status(r.getStatus())
                .adminResponse(r.getAdminResponse())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .userId(r.getUser().getId())
                .userNom(r.getUser().getNom())
                .userPrenom(r.getUser().getPrenom())
                .userEmail(r.getUser().getEmail())
                .userRole(r.getUser().getRole().name())
                .build();
    }
}
