package tn.tawiniya.tounisiya.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;
@Data
public class TrainingCenterRequest {
    @NotBlank
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String website;
    private String openingHours;
    @Valid
    private List<TrainingCourseInput> courses;
}