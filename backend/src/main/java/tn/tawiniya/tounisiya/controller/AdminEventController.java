package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.EventResponse;
import tn.tawiniya.tounisiya.dto.PagedResponse;
import tn.tawiniya.tounisiya.service.EventService;
import java.time.LocalDate;
/**
 * Gestion des événements — réservé aux administrateurs.
 * Accès restreint dans SecurityConfig via .requestMatchers("/api/admin/**").hasRole("ADMIN")
 */
@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
public class AdminEventController {
    private final EventService eventService;
    @GetMapping
    public PagedResponse<EventResponse> listAll(Pageable pageable) {
        return PagedResponse.from(eventService.listAll(pageable));
    }
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<EventResponse> create(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate eventDate,
            @RequestParam String location,
            @RequestParam(required = false) MultipartFile image
    ) {
        EventResponse response = eventService.create(title, description, eventDate, location, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}