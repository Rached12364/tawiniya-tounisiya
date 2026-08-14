package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.TechnicienProfileRequest;
import tn.tawiniya.tounisiya.dto.TechnicienProfileResponse;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.service.TechnicienProfileService;
/**
 * Endpoints pour un technicien connecté : consulter/créer/modifier son propre profil.
 * Accès : toute route sous /api/technicien-profile/** nécessite un utilisateur authentifié.
 */
@RestController
@RequestMapping("/api/technicien-profile")
@RequiredArgsConstructor
public class TechnicienProfileController {
    private final TechnicienProfileService profileService;
    @GetMapping("/mine")
    public ResponseEntity<TechnicienProfileResponse> getMine(@AuthenticationPrincipal User currentUser) {
        if (!profileService.hasProfile(currentUser)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(profileService.getMine(currentUser));
    }
    @PutMapping
    public TechnicienProfileResponse createOrUpdate(
            @AuthenticationPrincipal User currentUser,
            @RequestBody TechnicienProfileRequest request
    ) {
        return profileService.createOrUpdate(currentUser, request);
    }
    @PostMapping(value = "/photo-profil", consumes = "multipart/form-data")
    public TechnicienProfileResponse updatePhotoProfil(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("file") MultipartFile file
    ) {
        return profileService.updatePhotoProfil(currentUser, file);
    }
    @PostMapping(value = "/photo-couverture", consumes = "multipart/form-data")
    public TechnicienProfileResponse updatePhotoCouverture(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("file") MultipartFile file
    ) {
        return profileService.updatePhotoCouverture(currentUser, file);
    }
    @PostMapping(value = "/document/{type}", consumes = "multipart/form-data")
    public TechnicienProfileResponse updateDocument(
            @AuthenticationPrincipal User currentUser,
            @PathVariable String type,
            @RequestParam("file") MultipartFile file
    ) {
        return profileService.updateDocument(currentUser, type, file);
    }
}