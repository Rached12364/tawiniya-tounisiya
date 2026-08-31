package tn.tawiniya.tounisiya.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import tn.tawiniya.tounisiya.dto.*;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.service.ExpertConversationService;
import org.springframework.web.multipart.MultipartFile;
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
    @PostMapping(value = "/with/{expertId}", consumes = "multipart/form-data")
    public ExpertConversationDetailResponse sendToExpert(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long expertId,
            @RequestParam(required = false) String subject,
            @RequestParam String content,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment
    ) {
        return conversationService.sendToExpert(currentUser, expertId, subject, content, attachment);
    }
    @GetMapping("/{id}")
    public ExpertConversationDetailResponse getById(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id
    ) {
        return conversationService.getById(currentUser, id);
    }
    @PostMapping(value = "/{id}/messages", consumes = "multipart/form-data")
    public ExpertConversationDetailResponse reply(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long id,
            @RequestParam String content,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment
    ) {
        return conversationService.reply(currentUser, id, content, attachment);
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