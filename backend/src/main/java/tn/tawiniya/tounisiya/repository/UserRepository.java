package tn.tawiniya.tounisiya.repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tn.tawiniya.tounisiya.entity.Role;
import tn.tawiniya.tounisiya.entity.User;
import java.util.List;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    Page<User> findByRoleAndEnabledTrueAndIdNot(Role role, Long excludedId, Pageable pageable);
    @Query(value = "SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, COUNT(*) AS cnt " +
            "FROM users GROUP BY TO_CHAR(created_at, 'YYYY-MM') ORDER BY month",
            nativeQuery = true)
    List<Object[]> countUsersGroupedByMonth();
}