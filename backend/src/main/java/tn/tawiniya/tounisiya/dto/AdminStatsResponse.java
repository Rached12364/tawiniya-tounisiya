package tn.tawiniya.tounisiya.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private Map<String, Long> usersByRole;
    private long totalLoginAttempts;
    private long failedLoginAttempts;
}
