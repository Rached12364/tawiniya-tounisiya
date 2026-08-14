package tn.tawiniya.tounisiya.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
/**
 * Fiche personnelle complète d'un technicien, remplie par lui-même depuis son espace.
 * Un profil par utilisateur (relation 1-1).
 */
@Entity
@Table(name = "technicien_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicienProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    // --- Identité ---
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String cin;
    private String nomParent;
    private String adresse;
    // --- Contacts ---
    private String gsm;
    private String gsmParent;
    private String gsmBinome;
    private String email;
    private String facebook;
    private String tiktok;
    private String instagram;
    // --- Formation ---
    private String diplome;
    private String specialite;
    private String niveauScolaire;
    private boolean permisConduite;
    private LocalDate datePermis;
    // --- Contrat & administratif ---
    private String typeContrat;
    private String numeroCnss;
    private String numeroD17;
    private String numeroBanquePoste;
    // --- Santé ---
    @Enumerated(EnumType.STRING)
    private GroupeSanguin groupeSanguin;
    private Double poidsKg;
    private Double hauteurCm;
    private String pointureChaussure;
    private String tailleVetements;
    @Column(columnDefinition = "TEXT")
    private String maladiesChroniques;
    @Column(columnDefinition = "TEXT")
    private String allergies;
    @Column(columnDefinition = "TEXT")
    private String operations;
    private boolean tatouage;
    // --- Emploi ---
    private LocalDate dateEmbauche;
    private String experience;
    @Column(columnDefinition = "TEXT")
    private String societesEtPeriodes;
    private Double salaireDepart;
    private Integer nombreJoursConge;
    private String gsmSociete;
    // --- Documents & médias (chemins publics) ---
    private String photoProfilPath;
    private String photoCouverturePath;
    private String copieCinPath;
    private String copieExtraitNaissancePath;
    private String copieDiplomePath;
    private String copiePermisPath;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}