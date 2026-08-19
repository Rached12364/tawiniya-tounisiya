package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.Role;
/**
 * Vue publique d'un profil, visible par les autres utilisateurs (annuaire réseau).
 * Ne contient AUCUNE donnée sensible (CIN, salaire, numéros administratifs, santé...).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPublicProfileResponse {
    private Long id;
    private String nom;
    private String prenom;
    private Role role;
    private String bio;
    private String photoProfilPath;
    private String photoCouverturePath;
    private String phone;
    // ----- Technicien -----
    private String diplome;
    private String specialite;
    private String niveauScolaire;
    private String facebook;
    private String tiktok;
    private String instagram;
    // ----- Entreprise -----
    private String raisonSociale;
    private String secteurActivite;
    private String descriptionEntreprise;
    private String ville;
    private String gouvernorat;
    private String siteWeb;
    private String linkedin;
    private String entrepriseTelephone;
    private String entrepriseEmail;
    // ----- Stagiaire -----
    private String etablissement;
    private String domaineFormation;
    private String niveauFormation;
    // ----- Relation avec l'utilisateur courant -----
    private String connectionStatus;
    private Long connectionId;
}