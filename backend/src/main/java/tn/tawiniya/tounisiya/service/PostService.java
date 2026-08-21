package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.*;
import tn.tawiniya.tounisiya.entity.*;
import tn.tawiniya.tounisiya.exception.ForbiddenOperationException;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.PostCommentRepository;
import tn.tawiniya.tounisiya.repository.PostReactionRepository;
import tn.tawiniya.tounisiya.repository.PostRepository;
import tn.tawiniya.tounisiya.repository.PostSaveRepository;
import java.util.*;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final PostReactionRepository postReactionRepository;
    private final PostCommentRepository postCommentRepository;
    private final PostSaveRepository postSaveRepository;
    private final FileStorageService fileStorageService;
    private PostAuthorDto toAuthorDto(User u) {
        return PostAuthorDto.builder()
                .id(u.getId())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .role(u.getRole())
                .photoProfilPath(u.getPhotoProfilPath())
                .build();
    }
    private PostResponse toResponse(Post post, User currentUser) {
        List<PostReaction> reactions = postReactionRepository.findByPostId(post.getId());
        Map<String, Long> counts = new LinkedHashMap<>();
        for (ReactionType type : ReactionType.values()) {
            long c = reactions.stream().filter(r -> r.getType() == type).count();
            if (c > 0) counts.put(type.name(), c);
        }
        String myReaction = reactions.stream()
                .filter(r -> r.getUser().getId().equals(currentUser.getId()))
                .map(r -> r.getType().name())
                .findFirst()
                .orElse(null);
        long totalComments = postCommentRepository.countByPostId(post.getId());
        boolean savedByMe = postSaveRepository.findByPostIdAndUserId(post.getId(), currentUser.getId()).isPresent();
        boolean canEdit = post.getAuthor().getId().equals(currentUser.getId()) || currentUser.getRole() == Role.ADMIN;
        return PostResponse.builder()
                .id(post.getId())
                .author(toAuthorDto(post.getAuthor()))
                .content(post.getContent())
                .imagePath(post.getImagePath())
                .createdAt(post.getCreatedAt())
                .reactionsCount(counts)
                .totalReactions(reactions.size())
                .totalComments(totalComments)
                .myReaction(myReaction)
                .pinned(post.isPinned())
                .savedByMe(savedByMe)
                .canEdit(canEdit)
                .build();
    }
    @Transactional(readOnly = true)
    public Page<PostResponse> listFeed(User currentUser, Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(p -> toResponse(p, currentUser));
    }
    @Transactional(readOnly = true)
    public Page<PostResponse> listByAuthor(Long authorId, User currentUser, Pageable pageable) {
        return postRepository.findByAuthorIdOrderByPinnedDescCreatedAtDesc(authorId, pageable)
                .map(p -> toResponse(p, currentUser));
    }
    @Transactional(readOnly = true)
    public List<PostResponse> listSaved(User currentUser) {
        return postSaveRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(s -> toResponse(s.getPost(), currentUser))
                .collect(Collectors.toList());
    }
    @Transactional
    public PostResponse createPost(User currentUser, PostRequest request, MultipartFile image) {
        String imagePath = (image != null && !image.isEmpty()) ? fileStorageService.storeImage(image) : null;
        Post post = Post.builder()
                .author(currentUser)
                .content(request.getContent())
                .imagePath(imagePath)
                .build();
        postRepository.save(post);
        return toResponse(post, currentUser);
    }
    private Post findOwnedOrAdmin(User currentUser, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post introuvable : " + postId));
        boolean isOwner = post.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new ForbiddenOperationException("Action non autorisée sur ce post.");
        }
        return post;
    }
    @Transactional
    public PostResponse updatePost(User currentUser, Long postId, PostRequest request) {
        Post post = findOwnedOrAdmin(currentUser, postId);
        post.setContent(request.getContent());
        postRepository.save(post);
        return toResponse(post, currentUser);
    }
    @Transactional
    public void deletePost(User currentUser, Long postId) {
        Post post = findOwnedOrAdmin(currentUser, postId);
        if (post.getImagePath() != null) {
            fileStorageService.deleteImage(post.getImagePath());
        }
        postRepository.delete(post);
    }
    @Transactional
    public PostResponse togglePin(User currentUser, Long postId) {
        Post post = findOwnedOrAdmin(currentUser, postId);
        post.setPinned(!post.isPinned());
        postRepository.save(post);
        return toResponse(post, currentUser);
    }
    @Transactional
    public PostResponse toggleSave(User currentUser, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post introuvable : " + postId));
        Optional<PostSave> existing = postSaveRepository.findByPostIdAndUserId(postId, currentUser.getId());
        if (existing.isPresent()) {
            postSaveRepository.delete(existing.get());
        } else {
            postSaveRepository.save(PostSave.builder().post(post).user(currentUser).build());
        }
        return toResponse(post, currentUser);
    }
    @Transactional
    public PostResponse react(User currentUser, Long postId, ReactionType type) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post introuvable : " + postId));
        Optional<PostReaction> existing = postReactionRepository.findByPostIdAndUserId(postId, currentUser.getId());
        if (existing.isPresent()) {
            PostReaction r = existing.get();
            if (r.getType() == type) {
                postReactionRepository.delete(r);
            } else {
                r.setType(type);
                postReactionRepository.save(r);
            }
        } else {
            PostReaction r = PostReaction.builder().post(post).user(currentUser).type(type).build();
            postReactionRepository.save(r);
        }
        return toResponse(post, currentUser);
    }
    @Transactional(readOnly = true)
    public List<CommentResponse> listComments(Long postId) {
        return postCommentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(c -> CommentResponse.builder()
                        .id(c.getId())
                        .author(toAuthorDto(c.getAuthor()))
                        .content(c.getContent())
                        .createdAt(c.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
    @Transactional
    public CommentResponse addComment(User currentUser, Long postId, CommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post introuvable : " + postId));
        PostComment comment = PostComment.builder()
                .post(post)
                .author(currentUser)
                .content(request.getContent())
                .build();
        postCommentRepository.save(comment);
        return CommentResponse.builder()
                .id(comment.getId())
                .author(toAuthorDto(currentUser))
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
    @Transactional
    public void deleteComment(User currentUser, Long commentId) {
        PostComment comment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire introuvable : " + commentId));
        boolean isOwner = comment.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new ForbiddenOperationException("Vous ne pouvez pas supprimer ce commentaire.");
        }
        postCommentRepository.delete(comment);
    }
}