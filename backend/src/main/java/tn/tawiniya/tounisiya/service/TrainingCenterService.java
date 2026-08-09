package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.TrainingCenterRequest;
import tn.tawiniya.tounisiya.dto.TrainingCenterResponse;
import tn.tawiniya.tounisiya.dto.TrainingCourseInput;
import tn.tawiniya.tounisiya.entity.TrainingCenter;
import tn.tawiniya.tounisiya.entity.TrainingCourse;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.exception.ForbiddenOperationException;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.TrainingCenterRepository;
import java.util.ArrayList;
import java.util.List;
@Service
@RequiredArgsConstructor
public class TrainingCenterService {
    private final TrainingCenterRepository trainingCenterRepository;
    private final FileStorageService fileStorageService;
    /** Public/admin : tous les centres, paginés. */
    @Transactional(readOnly = true)
    public Page<TrainingCenterResponse> listAll(Pageable pageable) {
        return trainingCenterRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(TrainingCenterResponse::from);
    }
    /** Public : détail d'un centre. */
    @Transactional(readOnly = true)
    public TrainingCenterResponse getById(Long id) {
        return TrainingCenterResponse.from(findOrThrow(id));
    }
    /** Utilisateur connecté : ses propres centres. */
    @Transactional(readOnly = true)
    public List<TrainingCenterResponse> listMine(User owner) {
        return trainingCenterRepository.findByOwnerOrderByCreatedAtDesc(owner)
                .stream()
                .map(TrainingCenterResponse::from)
                .toList();
    }
    @Transactional
    public TrainingCenterResponse create(User owner, TrainingCenterRequest request, MultipartFile logo) {
        String logoPath = (logo != null && !logo.isEmpty()) ? fileStorageService.storeImage(logo) : null;
        TrainingCenter center = TrainingCenter.builder()
                .owner(owner)
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .website(request.getWebsite())
                .openingHours(request.getOpeningHours())
                .logoPath(logoPath)
                .build();
        applyCourses(center, request.getCourses());
        trainingCenterRepository.save(center);
        return TrainingCenterResponse.from(center);
    }
    /** Mise à jour par le propriétaire (403 si ce n'est pas le sien). */
    @Transactional
    public TrainingCenterResponse updateMine(User owner, Long id, TrainingCenterRequest request, MultipartFile logo) {
        TrainingCenter center = findOrThrow(id);
        assertOwner(center, owner);
        return applyUpdate(center, request, logo);
    }
    /** Mise à jour par l'admin, sans contrôle de propriétaire. */
    @Transactional
    public TrainingCenterResponse updateAsAdmin(Long id, TrainingCenterRequest request, MultipartFile logo) {
        TrainingCenter center = findOrThrow(id);
        return applyUpdate(center, request, logo);
    }
    @Transactional
    public void deleteMine(User owner, Long id) {
        TrainingCenter center = findOrThrow(id);
        assertOwner(center, owner);
        deleteInternal(center);
    }
    @Transactional
    public void deleteAsAdmin(Long id) {
        deleteInternal(findOrThrow(id));
    }
    private TrainingCenterResponse applyUpdate(TrainingCenter center, TrainingCenterRequest request, MultipartFile logo) {
        center.setName(request.getName());
        center.setDescription(request.getDescription());
        center.setAddress(request.getAddress());
        center.setPhone(request.getPhone());
        center.setEmail(request.getEmail());
        center.setWebsite(request.getWebsite());
        center.setOpeningHours(request.getOpeningHours());
        if (logo != null && !logo.isEmpty()) {
            if (center.getLogoPath() != null) {
                fileStorageService.deleteImage(center.getLogoPath());
            }
            center.setLogoPath(fileStorageService.storeImage(logo));
        }
        applyCourses(center, request.getCourses());
        return TrainingCenterResponse.from(center);
    }
    /** Remplace la liste des formations par celle fournie (les anciennes sont supprimées via orphanRemoval). */
    private void applyCourses(TrainingCenter center, List<TrainingCourseInput> courseInputs) {
        center.getCourses().clear();
        if (courseInputs == null) {
            return;
        }
        List<TrainingCourse> courses = new ArrayList<>();
        for (TrainingCourseInput input : courseInputs) {
            courses.add(TrainingCourse.builder()
                    .trainingCenter(center)
                    .title(input.getTitle())
                    .description(input.getDescription())
                    .build());
        }
        center.getCourses().addAll(courses);
    }
    private void deleteInternal(TrainingCenter center) {
        if (center.getLogoPath() != null) {
            fileStorageService.deleteImage(center.getLogoPath());
        }
        trainingCenterRepository.delete(center);
    }
    private TrainingCenter findOrThrow(Long id) {
        return trainingCenterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Centre de formation introuvable : " + id));
    }
    private void assertOwner(TrainingCenter center, User user) {
        if (!center.getOwner().getId().equals(user.getId())) {
            throw new ForbiddenOperationException("Vous n'êtes pas propriétaire de ce centre de formation.");
        }
    }
}