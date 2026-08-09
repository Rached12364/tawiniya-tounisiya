package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.tawiniya.tounisiya.dto.PagedResponse;
import tn.tawiniya.tounisiya.dto.TrainingCenterResponse;
import tn.tawiniya.tounisiya.service.TrainingCenterService;
/**
 * Lecture publique des centres de formation.
 * GET est autorisé sans authentification via SecurityConfig (HttpMethod.GET sur ce préfixe).
 */
@RestController
@RequestMapping("/api/training-centers")
@RequiredArgsConstructor
public class TrainingCenterController {
    private final TrainingCenterService trainingCenterService;
    @GetMapping
    public PagedResponse<TrainingCenterResponse> listAll(Pageable pageable) {
        return PagedResponse.from(trainingCenterService.listAll(pageable));
    }
    @GetMapping("/{id}")
    public TrainingCenterResponse getById(@PathVariable Long id) {
        return trainingCenterService.getById(id);
    }
}