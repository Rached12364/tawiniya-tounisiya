package tn.tawiniya.tounisiya.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import tn.tawiniya.tounisiya.dto.PagedResponse;
import tn.tawiniya.tounisiya.dto.ReclamationResponse;
import tn.tawiniya.tounisiya.dto.ReclamationStatusUpdateRequest;
import tn.tawiniya.tounisiya.entity.ReclamationStatus;
import tn.tawiniya.tounisiya.service.ReclamationService;

/**
 * Gestion des réclamations — réservé aux administrateurs.
 * Accès restreint dans SecurityConfig via .requestMatchers("/api/admin/**").hasRole("ADMIN")
 */
@RestController
@RequestMapping("/api/admin/reclamations")
@RequiredArgsConstructor
public class AdminReclamationController {

    private final ReclamationService reclamationService;

    @GetMapping
    public PagedResponse<ReclamationResponse> listAll(
            @RequestParam(required = false) ReclamationStatus status,
            Pageable pageable
    ) {
        return PagedResponse.from(reclamationService.listAll(status, pageable));
    }

    @PutMapping("/{id}/status")
    public ReclamationResponse updateStatus(
            @PathVariable Long id,
            @RequestBody ReclamationStatusUpdateRequest request
    ) {
        return reclamationService.updateStatus(id, request.getStatus(), request.getAdminResponse());
    }
}
