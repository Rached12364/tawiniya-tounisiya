package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tawiniya.tounisiya.dto.NotificationResponse;
import tn.tawiniya.tounisiya.dto.PostAuthorDto;
import tn.tawiniya.tounisiya.entity.*;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.NotificationRepository;
import tn.tawiniya.tounisiya.repository.UserRepository;
import java.util.List;
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private PostAuthorDto toAuthorDto(User u) {
        return PostAuthorDto.builder()
                .id(u.getId())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .role(u.getRole())
                .photoProfilPath(u.getPhotoProfilPath())
                .build();
    }
    private String buildMessage(NotificationType type, User actor) {
        String actorName = (actor.getPrenom() + " " + actor.getNom()).trim();
        return switch (type) {
            case LIKE_POST -> actorName + " a aimé votre publication.";
            case COMMENT_POST -> actorName + " a commenté votre publication.";
            case REPLY_COMMENT -> actorName + " a répondu à votre commentaire.";
            case LIKE_COMMENT -> actorName + " a aimé votre commentaire.";
            case NEW_POST -> actorName + " a publié une nouvelle actualité.";
        };
    }
    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .actor(toAuthorDto(n.getActor()))
                .postId(n.getPost() != null ? n.getPost().getId() : null)
                .commentId(n.getComment() != null ? n.getComment().getId() : null)
                .message(buildMessage(n.getType(), n.getActor()))
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
    @Transactional
    public void notify(User recipient, User actor, NotificationType type, Post post, PostComment comment) {
        if (recipient.getId().equals(actor.getId())) return;
        Notification notification = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(type)
                .post(post)
                .comment(comment)
                .build();
        notificationRepository.save(notification);
        NotificationResponse response = toResponse(notification);
        messagingTemplate.convertAndSendToUser(recipient.getEmail(), "/queue/notifications", response);
    }
    @Transactional
    public void notifyNewPost(Post post) {
        User author = post.getAuthor();
        List<User> recipients = userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(author.getId()) && u.isEnabled())
                .toList();
        for (User recipient : recipients) {
            notify(recipient, author, NotificationType.NEW_POST, post, null);
        }
    }
    @Transactional(readOnly = true)
    public Page<NotificationResponse> list(User currentUser, Pageable pageable) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(currentUser.getId(), pageable)
                .map(this::toResponse);
    }
    @Transactional(readOnly = true)
    public long countUnread(User currentUser) {
        return notificationRepository.countByRecipientIdAndReadFalse(currentUser.getId());
    }
    @Transactional
    public void markAsRead(User currentUser, Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification introuvable : " + notificationId));
        if (!n.getRecipient().getId().equals(currentUser.getId())) return;
        n.setRead(true);
        notificationRepository.save(n);
    }
    @Transactional
    public void markAllAsRead(User currentUser) {
        notificationRepository.markAllAsRead(currentUser.getId());
    }
}