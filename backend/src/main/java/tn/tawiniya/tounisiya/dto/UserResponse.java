package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.Role;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
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
    private String photoProfilPath;
    private String photoCouverturePath;
    private String bio;
    // ================== Profil Technicien ==================
    private LocalDate dateNaissance;
    private String cin;
    private String nomParent;
    private String adresse;
    private String gsmParent;
    private String gsmBinome;
    private String facebook;
    private String tiktok;
    private String instagram;
    private String diplome;
    private String specialite;
    private String niveauScolaire;
    private String permisConduire;
    private String typeContrat;
    private String numCnss;
    private String numD17;
    private String numeroBanque;
    private String groupeSanguin;
    private Double poids;
    private Double hauteur;
    private String pointureChaussure;
    private String tailleVetements;
    private String tatouage;
    private String maladiesChroniques;
    private String allergies;
    private String operations;
    private LocalDate dateEmbauche;
    private Integer experienceAnnees;
    private Double salaireDepart;
    private Integer joursCongeAutorises;
    private String gsmSocieteMSD;
    private List<ExperienceProDto> experiencesPro;
    // ================== Profil Entreprise ==================
    private String raisonSociale;
    private String matriculeFiscal;
    private String registreCommerce;
    private String secteurActivite;
    private String descriptionEntreprise;
    private Integer anneeCreation;
    private String tailleEntreprise;
    private String entrepriseAdresse;
    private String gouvernorat;
    private String ville;
    private String entrepriseTelephone;
    private String entrepriseEmail;
    private String siteWeb;
    private String linkedin;
    private String nomResponsable;
    private String fonctionResponsable;
    private String telephoneResponsable;
    private String emailResponsable;
    private String domainesActivite;
    private String technologiesUtilisees;
    private String servicesProposes;
    private Integer nombreTechniciens;
    private Integer nombreStagiaires;
    private Integer nombreEmployes;
    // ================== Profil Centre de formation ==================
    private String horaires;
    private String formationsProposees;
}