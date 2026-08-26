package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.SiteVideo;
import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SiteVideoResponse {
    private String videoPath;
    private LocalDateTime updatedAt;
    public static SiteVideoResponse from(SiteVideo v) {
        return SiteVideoResponse.builder()
                .videoPath(v.getVideoPath())
                .updatedAt(v.getUpdatedAt())
                .build();
    }
}