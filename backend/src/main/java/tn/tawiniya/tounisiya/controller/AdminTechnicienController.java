package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.tawiniya.tounisiya.dto.PagedResponse;
import tn.tawiniya.tounisiya.dto.TechnicienProfileResponse;
import tn.tawiniya.tounisiya.service.TechnicienProfileService;
/**
 * Gestion des profils techniciens — réservé aux administrateurs.
 * Accès restreint dans SecurityConfig via .requestMatchers("/api/admin/**").hasRole("ADMIN")
 */
@RestController
@RequestMapping("/api/admin/technicien-profiles")
@RequiredArgsConstructor
public class AdminTechnicienController {
    private final TechnicienProfileService profileService;
    @GetMapping
    public PagedResponse<TechnicienProfileResponse> listAll(Pageable pageable) {
        return PagedResponse.from(profileService.listAll(pageable));
    }
}