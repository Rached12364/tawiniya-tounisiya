package tn.tawiniya.tounisiya.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import tn.tawiniya.tounisiya.entity.Role;
import java.time.LocalDate;
import java.util.List;
@Data
public class RegisterRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;
    private String phone;
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;
    @NotNull(message = "Le rôle est obligatoire")
    private Role role;
    // ================== Profil Technicien (optionnel) ==================
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
    // ================== Profil Entreprise (optionnel) ==================
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
    // ================== Profil Centre de formation (optionnel) ==================
    private String horaires;
    private String formationsProposees;
}