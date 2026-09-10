package tn.tawiniya.tounisiya.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.tawiniya.tounisiya.entity.PostComment;
import java.util.List;
public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    List<PostComment> findByPostIdAndParentCommentIsNullOrderByCreatedAtAsc(Long postId);
    List<PostComment> findByParentCommentIdOrderByCreatedAtAsc(Long parentCommentId);
    long countByPostId(Long postId);
    @Query("SELECT p.author.id AS authorId, COUNT(c) AS total FROM PostComment c JOIN c.post p " +
           "WHERE c.author.id = :userId GROUP BY p.author.id")
    List<Object[]> countAuthorAffinityForUser(@Param("userId") Long userId);
    @Query("SELECT c.post.id AS postId, COUNT(c) AS total FROM PostComment c " +
           "WHERE c.post.id IN :postIds GROUP BY c.post.id")
    List<Object[]> countGroupedByPostIds(@Param("postIds") List<Long> postIds);
}