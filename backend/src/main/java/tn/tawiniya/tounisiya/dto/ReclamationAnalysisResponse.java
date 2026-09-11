package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.ReclamationType;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReclamationAnalysisResponse {
    private ReclamationType suggestedType;
    private String suggestedSubject;
    private String summary;
}