package tn.tawiniya.tounisiya.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
/**
 * Entité utilisateur. Implémente UserDetails pour s'intégrer directement
 * au mécanisme d'authentification de Spring Security.
 */
@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nom;
    @Column(nullable = false)
    private String prenom;
    @Column(nullable = false, unique = true)
    private String email;
    private String phone;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    @Builder.Default
    @Column(nullable = false)
    private boolean enabled = true;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "photo_profil_path")
    private String photoProfilPath;
    @Column(name = "photo_couverture_path")
    private String photoCouverturePath;
    @Column(columnDefinition = "TEXT")
    private String bio;
    // ================== Profil Technicien ==================
    // Tous ces champs restent null pour les rôles qui ne les utilisent pas.
    // ----- Identité -----
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;
    private String cin;
    @Column(name = "nom_parent")
    private String nomParent;
    private String adresse;
    // ----- Contacts -----
    @Column(name = "gsm_parent")
    private String gsmParent;
    @Column(name = "gsm_binome")
    private String gsmBinome;
    private String facebook;
    private String tiktok;
    private String instagram;
    // ----- Formation -----
    private String diplome;
    private String specialite;
    @Column(name = "niveau_scolaire")
    private String niveauScolaire;
    @Column(name = "permis_conduire")
    private String permisConduire; // "OUI" / "NON"
    // ----- Contrat & administratif -----
    @Column(name = "type_contrat")
    private String typeContrat;
    @Column(name = "num_cnss")
    private String numCnss;
    @Column(name = "num_d17")
    private String numD17;
    @Column(name = "numero_banque")
    private String numeroBanque;
    // ----- Santé -----
    @Column(name = "groupe_sanguin")
    private String groupeSanguin;
    private Double poids;
    private Double hauteur;
    @Column(name = "pointure_chaussure")
    private String pointureChaussure;
    @Column(name = "taille_vetements")
    private String tailleVetements;
    private String tatouage; // "OUI" / "NON"
    @Column(name = "maladies_chroniques", columnDefinition = "TEXT")
    private String maladiesChroniques;
    @Column(columnDefinition = "TEXT")
    private String allergies;
    @Column(columnDefinition = "TEXT")
    private String operations;
    // ----- Emploi -----
    @Column(name = "date_embauche")
    private LocalDate dateEmbauche;
    @Column(name = "experience_annees")
    private Integer experienceAnnees;
    @Column(name = "salaire_depart")
    private Double salaireDepart;
    @Column(name = "jours_conge_autorises")
    private Integer joursCongeAutorises;
    @Column(name = "gsm_societe_msd")
    private String gsmSocieteMSD;
    @ElementCollection
    @CollectionTable(name = "technicien_experiences", joinColumns = @JoinColumn(name = "user_id"))
    @Builder.Default
    private List<TechnicienExperience> experiencesPro = new ArrayList<>();
    // ================== Profil Entreprise ==================
    // Rempli uniquement quand role == ENTREPRISE ; null sinon.
    // ----- Informations générales -----
    @Column(name = "raison_sociale")
    private String raisonSociale;
    @Column(name = "matricule_fiscal")
    private String matriculeFiscal;
    @Column(name = "registre_commerce")
    private String registreCommerce;
    @Column(name = "secteur_activite")
    private String secteurActivite;
    @Column(name = "description_entreprise", columnDefinition = "TEXT")
    private String descriptionEntreprise;
    @Column(name = "annee_creation")
    private Integer anneeCreation;
    @Column(name = "taille_entreprise")
    private String tailleEntreprise;
    // ----- Coordonnées -----
    @Column(name = "entreprise_adresse")
    private String entrepriseAdresse;
    private String gouvernorat;
    private String ville;
    @Column(name = "entreprise_telephone")
    private String entrepriseTelephone;
    @Column(name = "entreprise_email")
    private String entrepriseEmail;
    @Column(name = "site_web")
    private String siteWeb;
    private String linkedin;
    // ----- Contact responsable -----
    @Column(name = "nom_responsable")
    private String nomResponsable;
    @Column(name = "fonction_responsable")
    private String fonctionResponsable;
    @Column(name = "telephone_responsable")
    private String telephoneResponsable;
    @Column(name = "email_responsable")
    private String emailResponsable;
    // ----- Informations professionnelles -----
    @Column(name = "domaines_activite", columnDefinition = "TEXT")
    private String domainesActivite;
    @Column(name = "technologies_utilisees", columnDefinition = "TEXT")
    private String technologiesUtilisees;
    @Column(name = "services_proposes", columnDefinition = "TEXT")
    private String servicesProposes;
    @Column(name = "nombre_techniciens")
    private Integer nombreTechniciens;
    @Column(name = "nombre_stagiaires")
    private Integer nombreStagiaires;
    @Column(name = "nombre_employes")
    private Integer nombreEmployes;
    // ================== Profil Centre de formation ==================
    // Rempli uniquement quand role == CENTRE_FORMATION ; null sinon.
    // (nom = nom du centre, prenom = nom du contact/responsable,
    //  adresse/siteWeb/photoProfilPath ci-dessus sont réutilisés : adresse du centre, site web, logo)
    private String horaires;
    @Column(name = "formations_proposees", columnDefinition = "TEXT")
    private String formationsProposees;
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    // ----- Implémentation UserDetails -----
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    @Override
    public String getUsername() {
        return email;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}