package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tawiniya.tounisiya.dto.LegalSectionRequest;
import tn.tawiniya.tounisiya.dto.LegalSectionResponse;
import tn.tawiniya.tounisiya.entity.LegalSection;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.LegalSectionRepository;
import java.util.List;
@Service
@RequiredArgsConstructor
public class LegalSectionService {
    private final LegalSectionRepository legalSectionRepository;
    /** Public : sections actives uniquement. */
    @Transactional(readOnly = true)
    public List<LegalSectionResponse> getActive() {
        return legalSectionRepository.findByActiveTrueOrderByOrderIndexAsc()
                .stream()
                .map(LegalSectionResponse::from)
                .toList();
    }
    /** Admin : toutes les sections (actives et inactives). */
    @Transactional(readOnly = true)
    public List<LegalSectionResponse> getAll() {
        return legalSectionRepository.findAllByOrderByOrderIndexAsc()
                .stream()
                .map(LegalSectionResponse::from)
                .toList();
    }
    @Transactional
    public LegalSectionResponse create(LegalSectionRequest request) {
        Integer orderIndex = request.getOrderIndex() != null
                ? request.getOrderIndex()
                : (int) legalSectionRepository.count();
        LegalSection section = LegalSection.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .orderIndex(orderIndex)
                .active(request.isActive())
                .build();
        legalSectionRepository.save(section);
        return LegalSectionResponse.from(section);
    }
    @Transactional
    public LegalSectionResponse update(Long id, LegalSectionRequest request) {
        LegalSection section = legalSectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section juridique introuvable : " + id));
        section.setTitle(request.getTitle());
        section.setContent(request.getContent());
        if (request.getOrderIndex() != null) {
            section.setOrderIndex(request.getOrderIndex());
        }
        section.setActive(request.isActive());
        return LegalSectionResponse.from(section);
    }
    @Transactional
    public void delete(Long id) {
        LegalSection section = legalSectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Section juridique introuvable : " + id));
        legalSectionRepository.delete(section);
    }
    @Transactional
    public void reorder(List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Long id = orderedIds.get(i);
            LegalSection section = legalSectionRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Section juridique introuvable : " + id));
            section.setOrderIndex(i);
        }
    }
}