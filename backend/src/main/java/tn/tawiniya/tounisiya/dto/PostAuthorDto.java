package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.Role;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostAuthorDto {
    private Long id;
    private String nom;
    private String prenom;
    private Role role;
    private String photoProfilPath;
}