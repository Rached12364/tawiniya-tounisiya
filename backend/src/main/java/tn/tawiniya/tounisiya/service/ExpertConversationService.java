package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tawiniya.tounisiya.dto.*;
import tn.tawiniya.tounisiya.entity.*;
import tn.tawiniya.tounisiya.exception.ForbiddenOperationException;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.ExpertConversationRepository;
import tn.tawiniya.tounisiya.repository.ExpertMessageRepository;
import tn.tawiniya.tounisiya.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ExpertConversationService {
    private final ExpertConversationRepository conversationRepository;
    private final ExpertMessageRepository messageRepository;
    private final UserRepository userRepository;
    private ConversationParticipant toParticipant(User u) {
        return ConversationParticipant.builder()
                .id(u.getId())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .photoProfilPath(u.getPhotoProfilPath())
                .build();
    }
    private ExpertMessageResponse toMessageResponse(ExpertMessage m, Long currentUserId) {
        User sender = m.getSender();
        return ExpertMessageResponse.builder()
                .id(m.getId())
                .senderId(sender.getId())
                .senderNom(sender.getNom())
                .senderPrenom(sender.getPrenom())
                .content(m.getContent())
                .createdAt(m.getCreatedAt())
                .mine(sender.getId().equals(currentUserId))
                .build();
    }
    private void checkParticipant(ExpertConversation c, Long userId) {
        boolean isParticipant = c.getRequester().getId().equals(userId) || c.getExpert().getId().equals(userId);
        if (!isParticipant) {
            throw new ForbiddenOperationException("Vous n'avez pas acces a cette conversation.");
        }
    }
    @Transactional(readOnly = true)
    public List<ExpertConversationSummaryResponse> listMine(User currentUser) {
        return conversationRepository.findAllForUser(currentUser.getId()).stream()
                .map(c -> {
                    boolean isExpertSide = c.getExpert().getId().equals(currentUser.getId());
                    User other = isExpertSide ? c.getRequester() : c.getExpert();
                    ExpertMessage last = messageRepository.findFirstByConversationIdOrderByCreatedAtDesc(c.getId());
                    return ExpertConversationSummaryResponse.builder()
                            .id(c.getId())
                            .subject(c.getSubject())
                            .status(c.getStatus())
                            .updatedAt(c.getUpdatedAt())
                            .otherUser(toParticipant(other))
                            .lastMessagePreview(last != null ? last.getContent() : null)
                            .isExpertSide(isExpertSide)
                            .build();
                })
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public ExpertConversationDetailResponse getWithExpert(User currentUser, Long expertId) {
        User expert = userRepository.findById(expertId)
                .orElseThrow(() -> new ResourceNotFoundException("Expert introuvable : " + expertId));
        var existing = conversationRepository.findByRequesterIdAndExpertId(currentUser.getId(), expertId);
        if (existing.isEmpty()) {
            return ExpertConversationDetailResponse.builder()
                    .id(null)
                    .subject(null)
                    .status(null)
                    .otherUser(toParticipant(expert))
                    .isExpertSide(false)
                    .messages(List.of())
                    .build();
        }
        return toDetail(existing.get(), currentUser.getId());
    }
    @Transactional(readOnly = true)
    public ExpertConversationDetailResponse getById(User currentUser, Long conversationId) {
        ExpertConversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation introuvable : " + conversationId));
        checkParticipant(c, currentUser.getId());
        return toDetail(c, currentUser.getId());
    }
    private ExpertConversationDetailResponse toDetail(ExpertConversation c, Long currentUserId) {
        boolean isExpertSide = c.getExpert().getId().equals(currentUserId);
        User other = isExpertSide ? c.getRequester() : c.getExpert();
        List<ExpertMessageResponse> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(c.getId())
                .stream().map(m -> toMessageResponse(m, currentUserId)).collect(Collectors.toList());
        return ExpertConversationDetailResponse.builder()
                .id(c.getId())
                .subject(c.getSubject())
                .status(c.getStatus())
                .otherUser(toParticipant(other))
                .isExpertSide(isExpertSide)
                .messages(messages)
                .build();
    }
    @Transactional
    public ExpertConversationDetailResponse sendToExpert(User currentUser, Long expertId, String subject, String content) {
        if (currentUser.getId().equals(expertId)) {
            throw new ForbiddenOperationException("Vous ne pouvez pas vous contacter vous-meme.");
        }
        User expert = userRepository.findById(expertId)
                .orElseThrow(() -> new ResourceNotFoundException("Expert introuvable : " + expertId));
        if (expert.getRole() != Role.EXPERT_JURIDIQUE) {
            throw new ForbiddenOperationException("Cet utilisateur n'est pas un expert juridique.");
        }
        ExpertConversation c = conversationRepository.findByRequesterIdAndExpertId(currentUser.getId(), expertId)
                .orElseGet(() -> conversationRepository.save(ExpertConversation.builder()
                        .requester(currentUser)
                        .expert(expert)
                        .subject((subject == null || subject.isBlank()) ? "Question a " + expert.getPrenom() + " " + expert.getNom() : subject)
                        .build()));
        return appendMessage(c, currentUser, content);
    }
    @Transactional
    public ExpertConversationDetailResponse reply(User currentUser, Long conversationId, String content) {
        ExpertConversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation introuvable : " + conversationId));
        checkParticipant(c, currentUser.getId());
        return appendMessage(c, currentUser, content);
    }
    private ExpertConversationDetailResponse appendMessage(ExpertConversation c, User sender, String content) {
        ExpertMessage message = ExpertMessage.builder()
                .conversation(c)
                .sender(sender)
                .content(content)
                .build();
        messageRepository.save(message);
        c.setUpdatedAt(java.time.LocalDateTime.now());
        if (c.getStatus() == ConversationStatus.RESOLUE) {
            c.setStatus(ConversationStatus.OUVERTE);
        } else if (c.getExpert().getId().equals(sender.getId()) && c.getStatus() == ConversationStatus.OUVERTE) {
            c.setStatus(ConversationStatus.EN_COURS);
        }
        conversationRepository.save(c);
        return toDetail(c, sender.getId());
    }
    @Transactional
    public ExpertConversationDetailResponse updateStatus(User currentUser, Long conversationId, ConversationStatus status) {
        ExpertConversation c = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation introuvable : " + conversationId));
        if (!c.getExpert().getId().equals(currentUser.getId())) {
            throw new ForbiddenOperationException("Seul l'expert peut changer le statut.");
        }
        c.setStatus(status);
        conversationRepository.save(c);
        return toDetail(c, currentUser.getId());
    }
}