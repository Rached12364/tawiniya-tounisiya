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
    private final FileStorageService fileStorageService;
    public List<SiteImageResponse> getActiveImages(ImageSection section) {
        return siteImageRepository.findBySectionAndActiveTrueOrderByDisplayOrderAsc(section)
                .stream().map(SiteImageResponse::from).toList();
    }
    public List<SiteImageResponse> getAllImages(ImageSection section) {
        return siteImageRepository.findBySectionOrderByDisplayOrderAsc(section)
                .stream().map(SiteImageResponse::from).toList();
    }
    @Transactional
    public SiteImageResponse uploadImage(MultipartFile file, ImageSection section, String title, String description, Integer displayOrder) {
        String path = fileStorageService.storeImage(file);
        SiteImage image = SiteImage.builder()
                .section(section)
                .title(title)
                .description(description)
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
    private SiteImage getOrThrow(Long id) {
        return siteImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image introuvable : " + id));
    }
}