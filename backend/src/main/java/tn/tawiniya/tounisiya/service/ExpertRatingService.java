package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tawiniya.tounisiya.dto.ExpertRatingResponse;
import tn.tawiniya.tounisiya.dto.ExpertRatingSummaryResponse;
import tn.tawiniya.tounisiya.entity.ExpertRating;
import tn.tawiniya.tounisiya.entity.Role;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.exception.ForbiddenOperationException;
import tn.tawiniya.tounisiya.exception.InvalidFileException;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.ExpertRatingRepository;
import tn.tawiniya.tounisiya.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ExpertRatingService {
    private final ExpertRatingRepository ratingRepository;
    private final UserRepository userRepository;
    private ExpertRatingResponse toResponse(ExpertRating r, Long currentUserId) {
        User author = r.getAuthor();
        return ExpertRatingResponse.builder()
                .id(r.getId())
                .authorId(author.getId())
                .authorNom(author.getNom())
                .authorPrenom(author.getPrenom())
                .authorPhotoProfilPath(author.getPhotoProfilPath())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .mine(currentUserId != null && author.getId().equals(currentUserId))
                .build();
    }
    @Transactional(readOnly = true)
    public ExpertRatingSummaryResponse getForExpert(Long expertId, User currentUser) {
        List<ExpertRating> ratings = ratingRepository.findByExpertIdOrderByCreatedAtDesc(expertId);
        Double avg = ratingRepository.averageForExpert(expertId);
        Long currentUserId = currentUser != null ? currentUser.getId() : null;
        List<ExpertRatingResponse> responses = ratings.stream()
                .map(r -> toResponse(r, currentUserId))
                .collect(Collectors.toList());
        return ExpertRatingSummaryResponse.builder()
                .average(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0)
                .count(ratings.size())
                .ratings(responses)
                .build();
    }
    @Transactional
    public ExpertRatingResponse submit(User currentUser, Long expertId, int rating, String comment) {
        if (currentUser.getId().equals(expertId)) {
            throw new ForbiddenOperationException("Vous ne pouvez pas vous noter vous-meme.");
        }
        if (rating < 1 || rating > 5) {
            throw new InvalidFileException("La note doit etre comprise entre 1 et 5.");
        }
        User expert = userRepository.findById(expertId)
                .orElseThrow(() -> new ResourceNotFoundException("Expert introuvable : " + expertId));
        if (expert.getRole() != Role.EXPERT_JURIDIQUE) {
            throw new ForbiddenOperationException("Cet utilisateur n'est pas un expert juridique.");
        }
        ExpertRating r = ratingRepository.findByExpertIdAndAuthorId(expertId, currentUser.getId())
                .orElseGet(() -> ExpertRating.builder().expert(expert).author(currentUser).build());
        r.setRating(rating);
        r.setComment(comment);
        ratingRepository.save(r);
        return toResponse(r, currentUser.getId());
    }
    @Transactional
    public void delete(User currentUser, Long expertId) {
        ExpertRating r = ratingRepository.findByExpertIdAndAuthorId(expertId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Avis introuvable."));
        ratingRepository.delete(r);
    }
}