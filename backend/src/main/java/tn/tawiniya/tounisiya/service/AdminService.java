package tn.tawiniya.tounisiya.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tawiniya.tounisiya.dto.AdminStatsResponse;
import tn.tawiniya.tounisiya.dto.UserMapper;
import tn.tawiniya.tounisiya.dto.UserResponse;
import tn.tawiniya.tounisiya.entity.Role;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.LoginHistoryRepository;
import tn.tawiniya.tounisiya.repository.UserRepository;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final UserMapper userMapper;

    public AdminStatsResponse getStats() {
        Map<String, Long> byRole = new LinkedHashMap<>();
        for (Role role : Role.values()) {
            byRole.put(role.name(), userRepository.countByRole(role));
        }

        long totalLogins = loginHistoryRepository.count();
        long failedLogins = loginHistoryRepository.countBySuccessFalse();

        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .usersByRole(byRole)
                .totalLoginAttempts(totalLogins)
                .failedLoginAttempts(failedLogins)
                .build();
    }

    public Page<UserResponse> listUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toResponse);
    }

    @Transactional
    public UserResponse setEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + userId));
        user.setEnabled(enabled);
        userRepository.save(user);
        return userMapper.toResponse(user);
    }
}
