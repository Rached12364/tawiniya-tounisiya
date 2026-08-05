package tn.tawiniya.tounisiya.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.tawiniya.tounisiya.dto.SiteImageResponse;
import tn.tawiniya.tounisiya.entity.ImageSection;
import tn.tawiniya.tounisiya.service.SiteContentService;

import java.util.List;

/**
 * Endpoints publics (lecture seule) consommés par la page d'accueil pour afficher
 * les images actuellement actives (hero slider, sponsors).
 */
@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final SiteContentService siteContentService;

    @GetMapping("/images/{section}")
    public List<SiteImageResponse> getActiveImages(@PathVariable ImageSection section) {
        return siteContentService.getActiveImages(section);
    }
}
