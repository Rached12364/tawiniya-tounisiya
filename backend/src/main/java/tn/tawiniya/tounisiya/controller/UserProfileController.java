package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import tn.tawiniya.tounisiya.dto.UpdateProfileRequest;
import tn.tawiniya.tounisiya.dto.UserResponse;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.service.UserProfileService;
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService profileService;
    @GetMapping("/me")
    public UserResponse getMine(@AuthenticationPrincipal User currentUser) {
        return profileService.getMine(currentUser);
    }
    @PutMapping("/me")
    public UserResponse updateMine(
            @AuthenticationPrincipal User currentUser,
            @RequestBody UpdateProfileRequest request
    ) {
        return profileService.updateMine(currentUser, request);
    }
    @PostMapping(value = "/me/photo-profil", consumes = "multipart/form-data")
    public UserResponse updatePhotoProfil(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("file") MultipartFile file
    ) {
        return profileService.updatePhotoProfil(currentUser, file);
    }
    @PostMapping(value = "/me/photo-couverture", consumes = "multipart/form-data")
    public UserResponse updatePhotoCouverture(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("file") MultipartFile file
    ) {
        return profileService.updatePhotoCouverture(currentUser, file);
    }
    @PostMapping(value = "/me/avocat-documents", consumes = "multipart/form-data")
    public UserResponse addAvocatDocuments(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("files") List<MultipartFile> files
    ) {
        return profileService.addAvocatDocuments(currentUser, files);
    }
}