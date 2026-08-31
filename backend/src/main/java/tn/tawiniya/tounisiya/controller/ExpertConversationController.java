package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tn.tawiniya.tounisiya.dto.*;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.service.ExpertConversationService;
import java.util.List;
/**
 * Messagerie entre un utilisateur (Technicien/Entreprise/Centre de formation/Beneficiaire)
 * et un expert juridique. Acces : tout utilisateur authentifie.
 */
@RestController
@RequestMapping("/api/expert-conversations")
@RequiredArgsConstructor
public class ExpertConversationController {
    private final ExpertConversationService conversationService;
    @GetMapping("/mine")
    public List<ExpertConversationSummaryResponse> listMine(@AuthenticationPrincipal User currentUser) {
        return conversationService.listMine(currentUser);
    }
    @GetMapping("/with/{expertId}")
    public ExpertConversationDetailResponse getWithExpert(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long expertId
    ) {
        return conversationService.getWithExpert(currentUser, expertId);
    }
    @PostMapping("/with/{expertId}")
    public ExpertConversationDetailResponse sendToExpert(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long expertId,
            @RequestBody SendExpertMessageRequest request
    ) {
        return conversationService.sendToExpert(currentUser, expertId, request.getSubject(), request.getContent());
    }
    @GetMapping("/{id}")
    public ExpertConversationDetailResponse getById(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id
    ) {
        return conversationService.getById(currentUser, id);
    }
    @PostMapping("/{id}/messages")
    public ExpertConversationDetailResponse reply(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @RequestBody SendExpertMessageRequest request
    ) {
        return conversationService.reply(currentUser, id, request.getContent());
    }
    @PutMapping("/{id}/status")
    public ExpertConversationDetailResponse updateStatus(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @RequestBody UpdateConversationStatusRequest request
    ) {
        return conversationService.updateStatus(currentUser, id, request.getStatus());
    }
}