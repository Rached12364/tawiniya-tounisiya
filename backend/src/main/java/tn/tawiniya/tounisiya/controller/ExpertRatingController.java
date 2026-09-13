package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tn.tawiniya.tounisiya.dto.ExpertRatingResponse;
import tn.tawiniya.tounisiya.dto.ExpertRatingSummaryResponse;
import tn.tawiniya.tounisiya.dto.SubmitExpertRatingRequest;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.service.ExpertRatingService;
/**
 * Avis et notes sur les experts juridiques. Lecture publique, ecriture reservee
 * aux utilisateurs authentifies (via .anyRequest().authenticated() dans SecurityConfig).
 */
@RestController
@RequestMapping("/api/expert-ratings")
@RequiredArgsConstructor
public class ExpertRatingController {
    private final ExpertRatingService ratingService;
    @GetMapping("/{expertId}")
    public ExpertRatingSummaryResponse getForExpert(
            @AuthenticationPrincipal(errorOnInvalidType = false) User currentUser,
            @PathVariable Long expertId
    ) {
        return ratingService.getForExpert(expertId, currentUser);
    }
    @PostMapping("/{expertId}")
    public ExpertRatingResponse submit(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long expertId,
            @RequestBody SubmitExpertRatingRequest request
    ) {
        return ratingService.submit(currentUser, expertId, request.getRating(), request.getComment());
    }
    @DeleteMapping("/{expertId}")
    public void delete(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long expertId
    ) {
        ratingService.delete(currentUser, expertId);
    }
}