package tn.tawiniya.tounisiya.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import tn.tawiniya.tounisiya.entity.LoginHistory;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.repository.LoginHistoryRepository;

import java.time.LocalDateTime;

/**
 * Enregistre chaque tentative de connexion (succès ET échec).
 *
 * Utilise Propagation.REQUIRES_NEW pour ouvrir une transaction indépendante :
 * même si l'authentification échoue et provoque un rollback de la transaction
 * appelante, la trace d'audit, elle, est bien persistée en base.
 */
@Service
@RequiredArgsConstructor
public class LoginAuditService {

    private final LoginHistoryRepository loginHistoryRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String email, User user, boolean success, HttpServletRequest request) {
        LoginHistory history = LoginHistory.builder()
                .email(email)
                .user(user)
                .success(success)
                .ip(extractIp(request))
                .userAgent(request != null ? request.getHeader("User-Agent") : null)
                .loginAt(LocalDateTime.now())
                .build();

        loginHistoryRepository.save(history);
    }

    private String extractIp(HttpServletRequest request) {
        if (request == null) {
            return null;
        }
        // Priorité au header X-Forwarded-For (utile derrière un proxy/reverse-proxy)
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
