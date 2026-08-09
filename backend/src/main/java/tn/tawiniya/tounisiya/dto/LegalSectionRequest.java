package tn.tawiniya.tounisiya.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class LegalSectionRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String content;
    private Integer orderIndex;
    private boolean active = true;
}