package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.EventResponse;
import tn.tawiniya.tounisiya.entity.Event;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.EventRepository;
import java.time.LocalDate;
@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final FileStorageService fileStorageService;
    /** Public : événements à venir uniquement. */
    @Transactional(readOnly = true)
    public Page<EventResponse> listUpcoming(Pageable pageable) {
        return eventRepository.findByEventDateGreaterThanEqualOrderByEventDateAsc(LocalDate.now(), pageable)
                .map(EventResponse::from);
    }
    /** Admin : tous les événements (passés et à venir). */
    @Transactional(readOnly = true)
    public Page<EventResponse> listAll(Pageable pageable) {
        return eventRepository.findAllByOrderByEventDateDesc(pageable)
                .map(EventResponse::from);
    }
    @Transactional
    public EventResponse create(String title, String description, LocalDate eventDate, String location, MultipartFile image) {
        String imagePath = (image != null && !image.isEmpty()) ? fileStorageService.storeImage(image) : null;
        Event event = Event.builder()
                .title(title)
                .description(description)
                .eventDate(eventDate)
                .location(location)
                .imagePath(imagePath)
                .build();
        eventRepository.save(event);
        return EventResponse.from(event);
    }
    @Transactional
    public void delete(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Événement introuvable : " + id));
        if (event.getImagePath() != null) {
            fileStorageService.deleteImage(event.getImagePath());
        }
        eventRepository.delete(event);
    }
}