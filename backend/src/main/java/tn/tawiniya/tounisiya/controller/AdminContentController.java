package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.SiteImageResponse;
import tn.tawiniya.tounisiya.entity.ImageSection;
import tn.tawiniya.tounisiya.service.SiteContentService;
import java.util.List;
@RestController
@RequestMapping("/api/admin/content")
@RequiredArgsConstructor
public class AdminContentController {
    private final SiteContentService siteContentService;
    @GetMapping("/images/{section}")
    public List<SiteImageResponse> getAllImages(@PathVariable ImageSection section) {
        return siteContentService.getAllImages(section);
    }
    @PostMapping(value = "/images", consumes = "multipart/form-data")
    public ResponseEntity<SiteImageResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("section") ImageSection section,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "displayOrder", required = false) Integer displayOrder
    ) {
        SiteImageResponse response = siteContentService.uploadImage(file, section, title, description, displayOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PutMapping("/images/{id}/enable")
    public SiteImageResponse enableImage(@PathVariable Long id) {
        return siteContentService.setActive(id, true);
    }
    @PutMapping("/images/{id}/disable")
    public SiteImageResponse disableImage(@PathVariable Long id) {
        return siteContentService.setActive(id, false);
    }
    @PutMapping("/images/{id}/order")
    public SiteImageResponse reorderImage(@PathVariable Long id, @RequestParam int order) {
        return siteContentService.reorder(id, order);
    }
    @DeleteMapping("/images/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        siteContentService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}