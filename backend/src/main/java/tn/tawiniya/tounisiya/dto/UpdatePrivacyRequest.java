package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePrivacyRequest {
    private Set<String> privateFields;
}