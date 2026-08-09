package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.ReclamationRequest;
import tn.tawiniya.tounisiya.dto.ReclamationResponse;
import tn.tawiniya.tounisiya.entity.Reclamation;
import tn.tawiniya.tounisiya.entity.ReclamationStatus;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.ReclamationRepository;
@Service
@RequiredArgsConstructor
public class ReclamationService {
    private final ReclamationRepository reclamationRepository;
    private final FileStorageService fileStorageService;
    @Transactional
    public ReclamationResponse create(User author, ReclamationRequest request, MultipartFile attachment) {
        String attachmentPath = fileStorageService.storeAttachment(attachment);
        Reclamation reclamation = Reclamation.builder()
                .user(author)
                .type(request.getType())
                .subject(request.getSubject())
                .description(request.getDescription())
                .attachmentPath(attachmentPath)
                .status(ReclamationStatus.OUVERTE)
                .build();
        reclamationRepository.save(reclamation);
        return ReclamationResponse.from(reclamation);
    }
    @Transactional(readOnly = true)
    public Page<ReclamationResponse> listMine(User author, Pageable pageable) {
        return reclamationRepository.findByUserOrderByCreatedAtDesc(author, pageable)
                .map(ReclamationResponse::from);
    }
    /** Admin : toutes les réclamations, avec filtre optionnel par statut. */
    @Transactional(readOnly = true)
    public Page<ReclamationResponse> listAll(ReclamationStatus statusFilter, Pageable pageable) {
        Page<Reclamation> page = statusFilter != null
                ? reclamationRepository.findByStatusOrderByCreatedAtDesc(statusFilter, pageable)
                : reclamationRepository.findAllByOrderByCreatedAtDesc(pageable);
        return page.map(ReclamationResponse::from);
    }
    @Transactional
    public ReclamationResponse updateStatus(Long id, ReclamationStatus status, String adminResponse) {
        Reclamation reclamation = reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réclamation introuvable : " + id));
        reclamation.setStatus(status);
        if (adminResponse != null && !adminResponse.isBlank()) {
            reclamation.setAdminResponse(adminResponse);
        }
        reclamationRepository.save(reclamation);
        return ReclamationResponse.from(reclamation);
        // Note : une notification par email à l'auteur pourrait être ajoutée ici
        // une fois la configuration SMTP du projet définie (voir README).
    }
}