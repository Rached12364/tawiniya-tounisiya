package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tn.tawiniya.tounisiya.dto.NotificationResponse;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.service.NotificationService;
import java.util.Map;
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    @GetMapping
    public Page<NotificationResponse> list(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return notificationService.list(currentUser, PageRequest.of(page, size));
    }
    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(@AuthenticationPrincipal User currentUser) {
        return Map.of("count", notificationService.countUnread(currentUser));
    }
    @PostMapping("/{id}/read")
    public Map<String, Boolean> markAsRead(@AuthenticationPrincipal User currentUser, @PathVariable Long id) {
        notificationService.markAsRead(currentUser, id);
        return Map.of("read", true);
    }
    @PostMapping("/read-all")
    public Map<String, Boolean> markAllAsRead(@AuthenticationPrincipal User currentUser) {
        notificationService.markAllAsRead(currentUser);
        return Map.of("read", true);
    }
}