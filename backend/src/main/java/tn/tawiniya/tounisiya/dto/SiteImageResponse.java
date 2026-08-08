package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.ImageSection;
import tn.tawiniya.tounisiya.entity.SiteImage;
import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteImageResponse {
    private Long id;
    private ImageSection section;
    private String title;
    private String description;
    private String imagePath;
    private Integer displayOrder;
    private boolean active;
    private LocalDateTime createdAt;
    public static SiteImageResponse from(SiteImage img) {
        return SiteImageResponse.builder()
                .id(img.getId())
                .section(img.getSection())
                .title(img.getTitle())
                .description(img.getDescription())
                .imagePath(img.getImagePath())
                .displayOrder(img.getDisplayOrder())
                .active(img.isActive())
                .createdAt(img.getCreatedAt())
                .build();
    }
}