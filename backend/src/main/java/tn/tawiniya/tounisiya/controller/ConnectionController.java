package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tn.tawiniya.tounisiya.dto.ConnectionResponse;
import tn.tawiniya.tounisiya.dto.UserCardResponse;
import tn.tawiniya.tounisiya.entity.Role;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.service.ConnectionService;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/network")
@RequiredArgsConstructor
public class ConnectionController {
    private final ConnectionService connectionService;
    @GetMapping("/browse/{role}")
    public Page<UserCardResponse> browse(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return connectionService.browseByRole(role, currentUser, PageRequest.of(page, size));
    }
    @PostMapping("/connect/{targetUserId}")
    public ConnectionResponse sendRequest(@AuthenticationPrincipal User currentUser, @PathVariable Long targetUserId) {
        return connectionService.sendRequest(currentUser, targetUserId);
    }
    @PostMapping("/{connectionId}/accept")
    public ConnectionResponse accept(@AuthenticationPrincipal User currentUser, @PathVariable Long connectionId) {
        return connectionService.respond(currentUser, connectionId, true);
    }
    @PostMapping("/{connectionId}/reject")
    public ConnectionResponse reject(@AuthenticationPrincipal User currentUser, @PathVariable Long connectionId) {
        return connectionService.respond(currentUser, connectionId, false);
    }
    @DeleteMapping("/{connectionId}")
    public Map<String, Boolean> remove(@AuthenticationPrincipal User currentUser, @PathVariable Long connectionId) {
        connectionService.cancelOrRemove(currentUser, connectionId);
        return Map.of("deleted", true);
    }
    @GetMapping("/connections")
    public List<ConnectionResponse> myConnections(@AuthenticationPrincipal User currentUser) {
        return connectionService.myConnections(currentUser);
    }
    @GetMapping("/invitations/received")
    public List<ConnectionResponse> received(@AuthenticationPrincipal User currentUser) {
        return connectionService.receivedInvitations(currentUser);
    }
    @GetMapping("/invitations/sent")
    public List<ConnectionResponse> sent(@AuthenticationPrincipal User currentUser) {
        return connectionService.sentInvitations(currentUser);
    }
}