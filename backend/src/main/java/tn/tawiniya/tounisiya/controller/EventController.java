package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.tawiniya.tounisiya.dto.EventResponse;
import tn.tawiniya.tounisiya.dto.PagedResponse;
import tn.tawiniya.tounisiya.service.EventService;
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;
    @GetMapping
    public PagedResponse<EventResponse> listUpcoming(Pageable pageable) {
        return PagedResponse.from(eventService.listUpcoming(pageable));
    }
}