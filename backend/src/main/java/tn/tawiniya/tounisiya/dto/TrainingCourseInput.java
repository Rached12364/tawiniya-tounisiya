package tn.tawiniya.tounisiya.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class TrainingCourseInput {
    @NotBlank
    private String title;
    private String description;
}