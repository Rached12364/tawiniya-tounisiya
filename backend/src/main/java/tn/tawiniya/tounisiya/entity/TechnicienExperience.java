package tn.tawiniya.tounisiya.entity;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicienExperience {
    private String societe;
    private String periode;
}
