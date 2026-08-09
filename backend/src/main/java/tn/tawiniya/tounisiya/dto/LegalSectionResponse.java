package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.LegalSection;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalSectionResponse {
    private Long id;
    private String title;
    private String content;
    private Integer orderIndex;
    private boolean active;
    public static LegalSectionResponse from(LegalSection s) {
        return LegalSectionResponse.builder()
                .id(s.getId())
                .title(s.getTitle())
                .content(s.getContent())
                .orderIndex(s.getOrderIndex())
                .active(s.isActive())
                .build();
    }
}