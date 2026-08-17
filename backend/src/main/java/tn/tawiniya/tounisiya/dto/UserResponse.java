package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.Role;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
/**
 * Représentation publique d'un utilisateur (jamais le mot de passe).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String phone;
    private Role role;
    private boolean enabled;
    private LocalDateTime createdAt;
    // ================== Profil Technicien ==================
    // null pour les autres rôles.
    // ----- Identité -----
    private LocalDate dateNaissance;
    private String cin;
    private String nomParent;
    private String adresse;
    // ----- Contacts -----
    private String gsmParent;
    private String gsmBinome;
    private String facebook;
    private String tiktok;
    private String instagram;
    // ----- Formation -----
    private String diplome;
    private String specialite;
    private String niveauScolaire;
    private String permisConduire;
    // ----- Contrat & administratif -----
    private String typeContrat;
    private String numCnss;
    private String numD17;
    private String numeroBanque;
    // ----- Santé -----
    private String groupeSanguin;
    private Double poids;
    private Double hauteur;
    private String pointureChaussure;
    private String tailleVetements;
    private String tatouage;
    private String maladiesChroniques;
    private String allergies;
    private String operations;
    // ----- Emploi -----
    private LocalDate dateEmbauche;
    private Integer experienceAnnees;
    private Double salaireDepart;
    private Integer joursCongeAutorises;
    private String gsmSocieteMSD;
    private List<ExperienceProDto> experiencesPro;
    // ================== Profil Entreprise ==================
    private String raisonSociale;
    private String matriculeFiscal;
    private String secteurActivite;
    // ================== Profil Stagiaire ==================
    private String etablissement;
    private String niveauFormation;
    private String domaineFormation;
    private LocalDate dateDebutStage;
    private LocalDate dateFinStage;
}
