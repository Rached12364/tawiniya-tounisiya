package tn.tawiniya.tounisiya.controller;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.tawiniya.tounisiya.dto.LegalSectionRequest;
import tn.tawiniya.tounisiya.dto.LegalSectionResponse;
import tn.tawiniya.tounisiya.dto.ReorderRequest;
import tn.tawiniya.tounisiya.service.LegalSectionService;
import java.util.List;
/**
 * Gestion du cadre juridique — réservé aux administrateurs.
 * Accès restreint dans SecurityConfig via .requestMatchers("/api/admin/**").hasRole("ADMIN")
 */
@RestController
@RequestMapping("/api/admin/juridique")
@RequiredArgsConstructor
public class AdminJuridiqueController {
    private final LegalSectionService legalSectionService;
    @GetMapping
    public List<LegalSectionResponse> getAll() {
        return legalSectionService.getAll();
    }
    @PostMapping
    public ResponseEntity<LegalSectionResponse> create(@Valid @RequestBody LegalSectionRequest request) {
        LegalSectionResponse response = legalSectionService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PutMapping("/{id}")
    public ResponseEntity<LegalSectionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody LegalSectionRequest request
    ) {
        return ResponseEntity.ok(legalSectionService.update(id, request));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        legalSectionService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@RequestBody ReorderRequest request) {
        legalSectionService.reorder(request.getOrderedIds());
        return ResponseEntity.noContent().build();
    }
}