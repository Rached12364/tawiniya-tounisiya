package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.TrainingCenterRequest;
import tn.tawiniya.tounisiya.dto.TrainingCenterResponse;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.service.TrainingCenterService;
import java.util.List;
/**
 * Gestion de ses propres centres de formation par tout utilisateur connecté.
 * N'importe quel rôle authentifié peut créer un centre (couvert par .anyRequest().authenticated()).
 */
@RestController
@RequestMapping("/api/training-centers/mine")
@RequiredArgsConstructor
public class MyTrainingCenterController {
    private final TrainingCenterService trainingCenterService;
    @GetMapping
    public List<TrainingCenterResponse> listMine(@AuthenticationPrincipal User currentUser) {
        return trainingCenterService.listMine(currentUser);
    }
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<TrainingCenterResponse> create(
            @AuthenticationPrincipal User currentUser,
            @RequestPart("data") TrainingCenterRequest request,
            @RequestPart(value = "logo", required = false) MultipartFile logo
    ) {
        TrainingCenterResponse response = trainingCenterService.create(currentUser, request, logo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public TrainingCenterResponse update(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @RequestPart("data") TrainingCenterRequest request,
            @RequestPart(value = "logo", required = false) MultipartFile logo
    ) {
        return trainingCenterService.updateMine(currentUser, id, request, logo);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User currentUser, @PathVariable Long id) {
        trainingCenterService.deleteMine(currentUser, id);
        return ResponseEntity.noContent().build();
    }
}