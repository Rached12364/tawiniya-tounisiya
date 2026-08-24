package tn.tawiniya.tounisiya.service;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tawiniya.tounisiya.dto.*;
import tn.tawiniya.tounisiya.entity.Role;
import tn.tawiniya.tounisiya.entity.TechnicienExperience;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.exception.EmailAlreadyExistsException;
import tn.tawiniya.tounisiya.repository.UserRepository;
import tn.tawiniya.tounisiya.security.JwtService;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final LoginAuditService loginAuditService;
    private final HttpServletRequest httpServletRequest;
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        User.UserBuilder builder = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true);
        if (request.getRole() == Role.TECHNICIEN) {
            List<TechnicienExperience> experiences = request.getExperiencesPro() == null
                    ? new ArrayList<>()
                    : request.getExperiencesPro().stream()
                        .map(e -> new TechnicienExperience(e.getSociete(), e.getPeriode()))
                        .collect(Collectors.toList());
            builder
                    .dateNaissance(request.getDateNaissance())
                    .cin(request.getCin())
                    .nomParent(request.getNomParent())
                    .adresse(request.getAdresse())
                    .gsmParent(request.getGsmParent())
                    .gsmBinome(request.getGsmBinome())
                    .facebook(request.getFacebook())
                    .tiktok(request.getTiktok())
                    .instagram(request.getInstagram())
                    .diplome(request.getDiplome())
                    .specialite(request.getSpecialite())
                    .niveauScolaire(request.getNiveauScolaire())
                    .permisConduire(request.getPermisConduire())
                    .typeContrat(request.getTypeContrat())
                    .numCnss(request.getNumCnss())
                    .numD17(request.getNumD17())
                    .numeroBanque(request.getNumeroBanque())
                    .groupeSanguin(request.getGroupeSanguin())
                    .poids(request.getPoids())
                    .hauteur(request.getHauteur())
                    .pointureChaussure(request.getPointureChaussure())
                    .tailleVetements(request.getTailleVetements())
                    .tatouage(request.getTatouage())
                    .maladiesChroniques(request.getMaladiesChroniques())
                    .allergies(request.getAllergies())
                    .operations(request.getOperations())
                    .dateEmbauche(request.getDateEmbauche())
                    .experienceAnnees(request.getExperienceAnnees())
                    .salaireDepart(request.getSalaireDepart())
                    .joursCongeAutorises(request.getJoursCongeAutorises())
                    .gsmSocieteMSD(request.getGsmSocieteMSD())
                    .experiencesPro(experiences);
        } else if (request.getRole() == Role.ENTREPRISE) {
            builder
                    .raisonSociale(request.getRaisonSociale())
                    .matriculeFiscal(request.getMatriculeFiscal())
                    .registreCommerce(request.getRegistreCommerce())
                    .secteurActivite(request.getSecteurActivite())
                    .descriptionEntreprise(request.getDescriptionEntreprise())
                    .anneeCreation(request.getAnneeCreation())
                    .tailleEntreprise(request.getTailleEntreprise())
                    .entrepriseAdresse(request.getEntrepriseAdresse())
                    .gouvernorat(request.getGouvernorat())
                    .ville(request.getVille())
                    .entrepriseTelephone(request.getEntrepriseTelephone())
                    .entrepriseEmail(request.getEntrepriseEmail())
                    .siteWeb(request.getSiteWeb())
                    .linkedin(request.getLinkedin())
                    .nomResponsable(request.getNomResponsable())
                    .fonctionResponsable(request.getFonctionResponsable())
                    .telephoneResponsable(request.getTelephoneResponsable())
                    .emailResponsable(request.getEmailResponsable())
                    .domainesActivite(request.getDomainesActivite())
                    .technologiesUtilisees(request.getTechnologiesUtilisees())
                    .servicesProposes(request.getServicesProposes())
                    .nombreTechniciens(request.getNombreTechniciens())
                    .nombreStagiaires(request.getNombreStagiaires())
                    .nombreEmployes(request.getNombreEmployes());
        } else if (request.getRole() == Role.CENTRE_FORMATION) {
            builder
                    .adresse(request.getAdresse())
                    .siteWeb(request.getSiteWeb())
                    .horaires(request.getHoraires())
                    .formationsProposees(request.getFormationsProposees());
        }
        User user = builder.build();
        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, userMapper.toResponse(user));
    }
    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException ex) {
            User possibleUser = userRepository.findByEmail(request.getEmail()).orElse(null);
            loginAuditService.record(request.getEmail(), possibleUser, false, httpServletRequest);
            throw ex;
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable après authentification"));
        loginAuditService.record(request.getEmail(), user, true, httpServletRequest);
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, userMapper.toResponse(user));
    }
}