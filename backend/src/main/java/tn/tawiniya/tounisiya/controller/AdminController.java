package tn.tawiniya.tounisiya.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import tn.tawiniya.tounisiya.dto.AdminStatsResponse;
import tn.tawiniya.tounisiya.dto.PagedResponse;
import tn.tawiniya.tounisiya.dto.UserResponse;
import tn.tawiniya.tounisiya.service.AdminService;

/**
 * Endpoints réservés aux administrateurs.
 * Accès restreint dans SecurityConfig via .requestMatchers("/api/admin/**").hasRole("ADMIN")
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public AdminStatsResponse getStats() {
        return adminService.getStats();
    }

    @GetMapping("/users")
    public PagedResponse<UserResponse> listUsers(Pageable pageable) {
        return PagedResponse.from(adminService.listUsers(pageable));
    }

    @PutMapping("/users/{id}/enable")
    public UserResponse enableUser(@PathVariable Long id) {
        return adminService.setEnabled(id, true);
    }

    @PutMapping("/users/{id}/disable")
    public UserResponse disableUser(@PathVariable Long id) {
        return adminService.setEnabled(id, false);
    }
}
