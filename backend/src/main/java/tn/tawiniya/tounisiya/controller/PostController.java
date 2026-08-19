package tn.tawiniya.tounisiya.controller;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.*;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.service.PostService;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    @GetMapping
    public Page<PostResponse> listFeed(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return postService.listFeed(currentUser, PageRequest.of(page, size));
    }
    @PostMapping(consumes = "multipart/form-data")
    public PostResponse create(
            @AuthenticationPrincipal User currentUser,
            @RequestPart("content") String content,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        PostRequest request = new PostRequest();
        request.setContent(content);
        return postService.createPost(currentUser, request, image);
    }
    @DeleteMapping("/{postId}")
    public Map<String, Boolean> delete(@AuthenticationPrincipal User currentUser, @PathVariable Long postId) {
        postService.deletePost(currentUser, postId);
        return Map.of("deleted", true);
    }
    @PostMapping("/{postId}/react")
    public PostResponse react(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long postId,
            @Valid @RequestBody ReactionRequest request
    ) {
        return postService.react(currentUser, postId, request.getType());
    }
    @GetMapping("/{postId}/comments")
    public List<CommentResponse> comments(@PathVariable Long postId) {
        return postService.listComments(postId);
    }
    @PostMapping("/{postId}/comments")
    public CommentResponse addComment(
            @AuthenticationPrincipal User currentUser,
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request
    ) {
        return postService.addComment(currentUser, postId, request);
    }
    @DeleteMapping("/comments/{commentId}")
    public Map<String, Boolean> deleteComment(@AuthenticationPrincipal User currentUser, @PathVariable Long commentId) {
        postService.deleteComment(currentUser, commentId);
        return Map.of("deleted", true);
    }
}