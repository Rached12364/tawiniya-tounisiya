package tn.tawiniya.tounisiya.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Image gérée par l'admin pour le contenu du site (hero slider, logos sponsors, ...).
 */
@Entity
@Table(name = "site_images")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ImageSection section;

    private String title;

    // Chemin public, ex: /uploads/images/abc123.jpg
    @Column(nullable = false)
    private String imagePath;

    @Builder.Default
    @Column(nullable = false)
    private Integer displayOrder = 0;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
