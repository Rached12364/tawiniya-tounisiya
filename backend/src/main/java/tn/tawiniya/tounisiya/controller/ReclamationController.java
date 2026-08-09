package tn.tawiniya.tounisiya.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.PagedResponse;
import tn.tawiniya.tounisiya.dto.ReclamationRequest;
import tn.tawiniya.tounisiya.dto.ReclamationResponse;
import tn.tawiniya.tounisiya.entity.ReclamationType;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.service.ReclamationService;

/**
 * Endpoints pour les utilisateurs connectés : soumettre une réclamation et consulter les siennes.
 * Accès : toute route sous /api/reclamations/** nécessite un utilisateur authentifié
 * (couvert par .anyRequest().authenticated() dans SecurityConfig).
 */
@RestController
@RequestMapping("/api/reclamations")
@RequiredArgsConstructor
public class ReclamationController {

    private final ReclamationService reclamationService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ReclamationResponse> create(
            @AuthenticationPrincipal User currentUser,
            @RequestParam ReclamationType type,
            @RequestParam String subject,
            @RequestParam String description,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment
    ) {
        ReclamationRequest request = new ReclamationRequest();
        request.setType(type);
        request.setSubject(subject);
        request.setDescription(description);

        ReclamationResponse response = reclamationService.create(currentUser, request, attachment);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/mine")
    public PagedResponse<ReclamationResponse> listMine(
            @AuthenticationPrincipal User currentUser,
            Pageable pageable
    ) {
        return PagedResponse.from(reclamationService.listMine(currentUser, pageable));
    }
}
