package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.Role;
/**
 * Représentation légère d'un utilisateur pour l'affichage en carte (annuaire / réseau).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCardResponse {
    private Long id;
    private String nom;
    private String prenom;
    private Role role;
    private String bio;
    private String photoProfilPath;
    private String photoCouverturePath;
    // Champ "sous-titre" contextuel selon le rôle (spécialité, secteur d'activité, filière...)
    private String subtitle;
    // Statut de connexion avec l'utilisateur courant : NONE, PENDING_SENT, PENDING_RECEIVED, ACCEPTED
    private String connectionStatus;
    private Long connectionId;
}