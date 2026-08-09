package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.TrainingCourse;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingCourseDto {
    private Long id;
    private String title;
    private String description;
    public static TrainingCourseDto from(TrainingCourse c) {
        return TrainingCourseDto.builder()
                .id(c.getId())
                .title(c.getTitle())
                .description(c.getDescription())
                .build();
    }
}