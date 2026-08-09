package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.TrainingCenter;
import java.time.LocalDateTime;
import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingCenterResponse {
    private Long id;
    private Long ownerId;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String website;
    private String logoPath;
    private String openingHours;
    private List<TrainingCourseDto> courses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public static TrainingCenterResponse from(TrainingCenter t) {
        return TrainingCenterResponse.builder()
                .id(t.getId())
                .ownerId(t.getOwner().getId())
                .name(t.getName())
                .description(t.getDescription())
                .address(t.getAddress())
                .phone(t.getPhone())
                .email(t.getEmail())
                .website(t.getWebsite())
                .logoPath(t.getLogoPath())
                .openingHours(t.getOpeningHours())
                .courses(t.getCourses().stream().map(TrainingCourseDto::from).toList())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}