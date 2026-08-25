package tn.tawiniya.tounisiya.service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tawiniya.tounisiya.dto.AdminStatsResponse;
import tn.tawiniya.tounisiya.dto.UserMapper;
import tn.tawiniya.tounisiya.dto.UserResponse;
import tn.tawiniya.tounisiya.entity.Role;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.exception.ForbiddenOperationException;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.LoginHistoryRepository;
import tn.tawiniya.tounisiya.repository.UserRepository;
import java.util.LinkedHashMap;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final UserMapper userMapper;
    @PersistenceContext
    private EntityManager entityManager;
    public AdminStatsResponse getStats() {
        Map<String, Long> byRole = new LinkedHashMap<>();
        for (Role role : Role.values()) {
            byRole.put(role.name(), userRepository.countByRole(role));
        }
        long totalLogins = loginHistoryRepository.count();
        long failedLogins = loginHistoryRepository.countBySuccessFalse();
        return AdminStatsResponse.builder()
                .totalUsers(userRepository.count())
                .usersByRole(byRole)
                .totalLoginAttempts(totalLogins)
                .failedLoginAttempts(failedLogins)
                .build();
    }
    @Transactional(readOnly = true)
    public Page<UserResponse> listUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toResponse);
    }
    @Transactional
    public UserResponse setEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + userId));
        user.setEnabled(enabled);
        userRepository.save(user);
        return userMapper.toResponse(user);
    }
    /**
     * Supprime definitivement un compte et toutes les donnees qui lui sont liees.
     * Aucune contrainte FK n'a de ON DELETE CASCADE en base, donc le nettoyage
     * se fait manuellement, des tables les plus dependantes vers users.
     */
    @Transactional
    public void deleteUser(Long userId, Long currentAdminId) {
        if (userId.equals(currentAdminId)) {
            throw new ForbiddenOperationException("Vous ne pouvez pas supprimer votre propre compte.");
        }
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Utilisateur introuvable : " + userId);
        }
        // 1) Reponses (replies) dont le parent va etre supprime : on detache le lien plutot que de les supprimer en cascade
        entityManager.createNativeQuery(
                "UPDATE post_comments SET parent_comment_id = NULL WHERE parent_comment_id IN (" +
                        "SELECT id FROM post_comments WHERE author_id = :uid OR post_id IN (SELECT id FROM posts WHERE author_id = :uid))"
        ).setParameter("uid", userId).executeUpdate();
        // 2) Reactions sur les commentaires concernes
        entityManager.createNativeQuery(
                "DELETE FROM comment_reactions WHERE user_id = :uid OR comment_id IN (" +
                        "SELECT id FROM post_comments WHERE author_id = :uid OR post_id IN (SELECT id FROM posts WHERE author_id = :uid))"
        ).setParameter("uid", userId).executeUpdate();
        // 3) Commentaires (les siens + ceux sur ses posts)
        entityManager.createNativeQuery(
                "DELETE FROM post_comments WHERE author_id = :uid OR post_id IN (SELECT id FROM posts WHERE author_id = :uid)"
        ).setParameter("uid", userId).executeUpdate();
        // 4) Reactions et enregistrements sur ses posts / ses reactions sur d'autres posts
        entityManager.createNativeQuery(
                "DELETE FROM post_reactions WHERE user_id = :uid OR post_id IN (SELECT id FROM posts WHERE author_id = :uid)"
        ).setParameter("uid", userId).executeUpdate();
        entityManager.createNativeQuery(
                "DELETE FROM post_saves WHERE user_id = :uid OR post_id IN (SELECT id FROM posts WHERE author_id = :uid)"
        ).setParameter("uid", userId).executeUpdate();
        // 5) Ses posts
        entityManager.createNativeQuery("DELETE FROM posts WHERE author_id = :uid")
                .setParameter("uid", userId).executeUpdate();
        // 6) Connexions (demandes envoyees/recues)
        entityManager.createNativeQuery("DELETE FROM connections WHERE requester_id = :uid OR receiver_id = :uid")
                .setParameter("uid", userId).executeUpdate();
        // 7) Historique de connexion
        entityManager.createNativeQuery("DELETE FROM login_history WHERE user_id = :uid")
                .setParameter("uid", userId).executeUpdate();
        // 8) Reclamations
        entityManager.createNativeQuery("DELETE FROM reclamations WHERE user_id = :uid")
                .setParameter("uid", userId).executeUpdate();
        // 9) Experiences technicien (table annexe liee au champ experiencesPro)
        entityManager.createNativeQuery("DELETE FROM technicien_experiences WHERE user_id = :uid")
                .setParameter("uid", userId).executeUpdate();
        // 10) Table technicien_profiles (residuelle, hors du modele User actuel)
        entityManager.createNativeQuery("DELETE FROM technicien_profiles WHERE user_id = :uid")
                .setParameter("uid", userId).executeUpdate();
        // 11) Centres de formation residuels (module supprime, table encore presente)
        entityManager.createNativeQuery(
                "DELETE FROM training_courses WHERE training_center_id IN (SELECT id FROM training_centers WHERE owner_id = :uid)"
        ).setParameter("uid", userId).executeUpdate();
        entityManager.createNativeQuery("DELETE FROM training_centers WHERE owner_id = :uid")
                .setParameter("uid", userId).executeUpdate();
        // 12) L'utilisateur lui-meme
        entityManager.createNativeQuery("DELETE FROM users WHERE id = :uid")
                .setParameter("uid", userId).executeUpdate();
    }
}