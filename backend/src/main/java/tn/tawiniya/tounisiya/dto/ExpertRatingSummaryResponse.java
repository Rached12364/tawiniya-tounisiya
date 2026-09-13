package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpertRatingSummaryResponse {
    private double average;
    private long count;
    private List<ExpertRatingResponse> ratings;
}