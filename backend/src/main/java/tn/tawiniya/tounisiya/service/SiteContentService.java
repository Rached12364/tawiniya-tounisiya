package tn.tawiniya.tounisiya.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.SiteImageResponse;
import tn.tawiniya.tounisiya.entity.ImageSection;
import tn.tawiniya.tounisiya.entity.SiteImage;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.SiteImageRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteContentService {

    private final SiteImageRepository siteImageRepository;
    private final tn.tawiniya.tounisiya.repository.SiteVideoRepository siteVideoRepository;
    private final FileStorageService fileStorageService;

    /** Utilisé côté public (page d'accueil) : uniquement les images actives. */
    public List<SiteImageResponse> getActiveImages(ImageSection section) {
        return siteImageRepository.findBySectionAndActiveTrueOrderByDisplayOrderAsc(section)
                .stream().map(SiteImageResponse::from).toList();
    }

    /** Utilisé côté admin : toutes les images (actives ou non). */
    public List<SiteImageResponse> getAllImages(ImageSection section) {
        return siteImageRepository.findBySectionOrderByDisplayOrderAsc(section)
                .stream().map(SiteImageResponse::from).toList();
    }

    @Transactional
    public SiteImageResponse uploadImage(MultipartFile file, ImageSection section, String title, Integer displayOrder) {
        String path = fileStorageService.storeImage(file);

        SiteImage image = SiteImage.builder()
                .section(section)
                .title(title)
                .imagePath(path)
                .displayOrder(displayOrder != null ? displayOrder : 0)
                .active(true)
                .build();

        siteImageRepository.save(image);
        return SiteImageResponse.from(image);
    }

    @Transactional
    public SiteImageResponse setActive(Long id, boolean active) {
        SiteImage image = getOrThrow(id);
        image.setActive(active);
        siteImageRepository.save(image);
        return SiteImageResponse.from(image);
    }

    @Transactional
    public SiteImageResponse reorder(Long id, int newOrder) {
        SiteImage image = getOrThrow(id);
        image.setDisplayOrder(newOrder);
        siteImageRepository.save(image);
        return SiteImageResponse.from(image);
    }

    @Transactional
    public void deleteImage(Long id) {
        SiteImage image = getOrThrow(id);
        fileStorageService.deleteImage(image.getImagePath());
        siteImageRepository.delete(image);
    }

    /** Video de presentation actuelle, si une a ete uploadee. */
    public tn.tawiniya.tounisiya.dto.SiteVideoResponse getVideo() {
        return siteVideoRepository.findAll().stream()
                .findFirst()
                .map(tn.tawiniya.tounisiya.dto.SiteVideoResponse::from)
                .orElse(null);
    }
    @Transactional
    public tn.tawiniya.tounisiya.dto.SiteVideoResponse uploadVideo(MultipartFile file) {
        String path = fileStorageService.storeVideo(file);
        tn.tawiniya.tounisiya.entity.SiteVideo video = siteVideoRepository.findAll().stream()
                .findFirst()
                .orElse(tn.tawiniya.tounisiya.entity.SiteVideo.builder().build());
        video.setVideoPath(path);
        siteVideoRepository.save(video);
        return tn.tawiniya.tounisiya.dto.SiteVideoResponse.from(video);
    }
    private SiteImage getOrThrow(Long id) {
        return siteImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image introuvable : " + id));
    }
}
