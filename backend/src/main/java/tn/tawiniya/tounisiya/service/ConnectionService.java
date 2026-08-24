package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tawiniya.tounisiya.dto.ConnectionResponse;
import tn.tawiniya.tounisiya.dto.UserCardResponse;
import tn.tawiniya.tounisiya.dto.UserPublicProfileResponse;
import tn.tawiniya.tounisiya.entity.Connection;
import tn.tawiniya.tounisiya.entity.ConnectionStatus;
import tn.tawiniya.tounisiya.entity.Role;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.exception.ForbiddenOperationException;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.ConnectionRepository;
import tn.tawiniya.tounisiya.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ConnectionService {
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private String subtitleFor(User u) {
        return switch (u.getRole()) {
            case TECHNICIEN -> u.getSpecialite();
            case ENTREPRISE -> u.getSecteurActivite();
            case CENTRE_FORMATION -> u.getFormationsProposees();
            default -> null;
        };
    }
    private UserCardResponse toCard(User u, User currentUser) {
        String connectionStatus = "NONE";
        Long connectionId = null;
        if (!u.getId().equals(currentUser.getId())) {
            var existing = connectionRepository.findBetween(currentUser.getId(), u.getId());
            if (existing.isPresent()) {
                Connection c = existing.get();
                connectionId = c.getId();
                if (c.getStatus() == ConnectionStatus.ACCEPTED) {
                    connectionStatus = "ACCEPTED";
                } else if (c.getStatus() == ConnectionStatus.PENDING) {
                    connectionStatus = c.getRequester().getId().equals(currentUser.getId())
                            ? "PENDING_SENT" : "PENDING_RECEIVED";
                }
            }
        }
        return UserCardResponse.builder()
                .id(u.getId())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .role(u.getRole())
                .bio(u.getBio())
                .photoProfilPath(u.getPhotoProfilPath())
                .photoCouverturePath(u.getPhotoCouverturePath())
                .subtitle(subtitleFor(u))
                .connectionStatus(connectionStatus)
                .connectionId(connectionId)
                .build();
    }
    @Transactional(readOnly = true)
    public UserPublicProfileResponse getPublicProfile(Long targetUserId, User currentUser) {
        User u = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + targetUserId));
        String connectionStatus = "NONE";
        Long connectionId = null;
        if (!u.getId().equals(currentUser.getId())) {
            var existing = connectionRepository.findBetween(currentUser.getId(), u.getId());
            if (existing.isPresent()) {
                Connection c = existing.get();
                connectionId = c.getId();
                if (c.getStatus() == ConnectionStatus.ACCEPTED) {
                    connectionStatus = "ACCEPTED";
                } else if (c.getStatus() == ConnectionStatus.PENDING) {
                    connectionStatus = c.getRequester().getId().equals(currentUser.getId())
                            ? "PENDING_SENT" : "PENDING_RECEIVED";
                }
            }
        } else {
            connectionStatus = "SELF";
        }
        return UserPublicProfileResponse.builder()
                .id(u.getId())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .role(u.getRole())
                .bio(u.getBio())
                .photoProfilPath(u.getPhotoProfilPath())
                .photoCouverturePath(u.getPhotoCouverturePath())
                .phone(u.getPhone())
                .diplome(u.getDiplome())
                .specialite(u.getSpecialite())
                .niveauScolaire(u.getNiveauScolaire())
                .facebook(u.getFacebook())
                .tiktok(u.getTiktok())
                .instagram(u.getInstagram())
                .raisonSociale(u.getRaisonSociale())
                .secteurActivite(u.getSecteurActivite())
                .descriptionEntreprise(u.getDescriptionEntreprise())
                .ville(u.getVille())
                .gouvernorat(u.getGouvernorat())
                .siteWeb(u.getSiteWeb())
                .linkedin(u.getLinkedin())
                .entrepriseTelephone(u.getEntrepriseTelephone())
                .entrepriseEmail(u.getEntrepriseEmail())
                .adresse(u.getAdresse())
                .horaires(u.getHoraires())
                .formationsProposees(u.getFormationsProposees())
                .connectionStatus(connectionStatus)
                .connectionId(connectionId)
                .build();
    }
    @Transactional(readOnly = true)
    public Page<UserCardResponse> browseByRole(Role role, User currentUser, Pageable pageable) {
        return userRepository.findByRoleAndEnabledTrueAndIdNot(role, currentUser.getId(), pageable)
                .map(u -> toCard(u, currentUser));
    }
    @Transactional
    public ConnectionResponse sendRequest(User currentUser, Long targetUserId) {
        if (currentUser.getId().equals(targetUserId)) {
            throw new ForbiddenOperationException("Vous ne pouvez pas vous connecter à vous-même.");
        }
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + targetUserId));
        var existing = connectionRepository.findBetween(currentUser.getId(), targetUserId);
        if (existing.isPresent()) {
            throw new ForbiddenOperationException("Une relation existe déjà avec cet utilisateur.");
        }
        Connection connection = Connection.builder()
                .requester(currentUser)
                .receiver(target)
                .status(ConnectionStatus.PENDING)
                .build();
        connectionRepository.save(connection);
        return toResponse(connection, currentUser);
    }
    @Transactional
    public ConnectionResponse respond(User currentUser, Long connectionId, boolean accept) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable : " + connectionId));
        if (!connection.getReceiver().getId().equals(currentUser.getId())) {
            throw new ForbiddenOperationException("Vous ne pouvez pas répondre à cette demande.");
        }
        connection.setStatus(accept ? ConnectionStatus.ACCEPTED : ConnectionStatus.REJECTED);
        connection.setRespondedAt(java.time.LocalDateTime.now());
        connectionRepository.save(connection);
        return toResponse(connection, currentUser);
    }
    @Transactional
    public void cancelOrRemove(User currentUser, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable : " + connectionId));
        boolean isParty = connection.getRequester().getId().equals(currentUser.getId())
                || connection.getReceiver().getId().equals(currentUser.getId());
        if (!isParty) {
            throw new ForbiddenOperationException("Vous ne pouvez pas supprimer cette relation.");
        }
        connectionRepository.delete(connection);
    }
    @Transactional(readOnly = true)
    public List<ConnectionResponse> myConnections(User currentUser) {
        return connectionRepository.findAllByUserAndStatus(currentUser.getId(), ConnectionStatus.ACCEPTED)
                .stream().map(c -> toResponse(c, currentUser)).collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<ConnectionResponse> receivedInvitations(User currentUser) {
        return connectionRepository.findByReceiverIdAndStatus(currentUser.getId(), ConnectionStatus.PENDING)
                .stream().map(c -> toResponse(c, currentUser)).collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<ConnectionResponse> sentInvitations(User currentUser) {
        return connectionRepository.findByRequesterIdAndStatus(currentUser.getId(), ConnectionStatus.PENDING)
                .stream().map(c -> toResponse(c, currentUser)).collect(Collectors.toList());
    }
    private ConnectionResponse toResponse(Connection c, User currentUser) {
        boolean sentByMe = c.getRequester().getId().equals(currentUser.getId());
        User other = sentByMe ? c.getReceiver() : c.getRequester();
        return ConnectionResponse.builder()
                .id(c.getId())
                .otherUser(toCard(other, currentUser))
                .status(c.getStatus().name())
                .createdAt(c.getCreatedAt())
                .sentByMe(sentByMe)
                .build();
    }
}