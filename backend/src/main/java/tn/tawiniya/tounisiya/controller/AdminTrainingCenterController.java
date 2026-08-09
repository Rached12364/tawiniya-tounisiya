package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.PagedResponse;
import tn.tawiniya.tounisiya.dto.TrainingCenterRequest;
import tn.tawiniya.tounisiya.dto.TrainingCenterResponse;
import tn.tawiniya.tounisiya.service.TrainingCenterService;
/**
 * Gestion de tous les centres de formation — réservé aux administrateurs.
 * Accès restreint dans SecurityConfig via .requestMatchers("/api/admin/**").hasRole("ADMIN")
 */
@RestController
@RequestMapping("/api/admin/training-centers")
@RequiredArgsConstructor
public class AdminTrainingCenterController {
    private final TrainingCenterService trainingCenterService;
    @GetMapping
    public PagedResponse<TrainingCenterResponse> listAll(Pageable pageable) {
        return PagedResponse.from(trainingCenterService.listAll(pageable));
    }
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public TrainingCenterResponse update(
            @PathVariable Long id,
            @RequestPart("data") TrainingCenterRequest request,
            @RequestPart(value = "logo", required = false) MultipartFile logo
    ) {
        return trainingCenterService.updateAsAdmin(id, request, logo);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trainingCenterService.deleteAsAdmin(id);
        return ResponseEntity.noContent().build();
    }
}