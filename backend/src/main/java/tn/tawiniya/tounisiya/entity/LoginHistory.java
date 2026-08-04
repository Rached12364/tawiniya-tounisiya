package tn.tawiniya.tounisiya.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Historique des tentatives de connexion (succès ET échecs).
 * `email` est toujours renseigné (même si l'utilisateur n'existe pas),
 * `user` est renseigné uniquement si l'utilisateur a été trouvé.
 */
@Entity
@Table(name = "login_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private boolean success;

    private String ip;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "login_at", nullable = false, updatable = false)
    private LocalDateTime loginAt;

    @PrePersist
    protected void onCreate() {
        if (this.loginAt == null) {
            this.loginAt = LocalDateTime.now();
        }
    }
}
