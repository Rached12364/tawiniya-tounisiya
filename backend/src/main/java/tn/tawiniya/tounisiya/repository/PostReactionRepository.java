package tn.tawiniya.tounisiya.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.tawiniya.tounisiya.entity.PostReaction;
import tn.tawiniya.tounisiya.entity.ReactionType;
import java.util.List;
import java.util.Optional;
public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {
    Optional<PostReaction> findByPostIdAndUserId(Long postId, Long userId);
    List<PostReaction> findByPostId(Long postId);
    long countByPostIdAndType(Long postId, ReactionType type);
    @Query("SELECT r.post.id AS postId, r.type AS type, COUNT(r) AS total FROM PostReaction r " +
           "WHERE r.post.id IN :postIds GROUP BY r.post.id, r.type")
    List<Object[]> countGroupedByPostIds(@Param("postIds") List<Long> postIds);
    @Query("SELECT p.author.id AS authorId, COUNT(r) AS total FROM PostReaction r JOIN r.post p " +
           "WHERE r.user.id = :userId GROUP BY p.author.id")
    List<Object[]> countAuthorAffinityForUser(@Param("userId") Long userId);
    @Query("SELECT r.post.id AS postId, COUNT(r) AS total FROM PostReaction r " +
           "WHERE r.post.id IN :postIds GROUP BY r.post.id")
    List<Object[]> countTotalGroupedByPostIds(@Param("postIds") List<Long> postIds);
}