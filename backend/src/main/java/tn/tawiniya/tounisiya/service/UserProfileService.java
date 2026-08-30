package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.UpdateProfileRequest;
import tn.tawiniya.tounisiya.dto.UserMapper;
import tn.tawiniya.tounisiya.dto.UserResponse;
import tn.tawiniya.tounisiya.entity.Role;
import tn.tawiniya.tounisiya.entity.TechnicienExperience;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final FileStorageService fileStorageService;
    @Transactional(readOnly = true)
    public UserResponse getMine(User currentUser) {
        User fresh = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable"));
        return userMapper.toResponse(fresh);
    }
    @Transactional
    public UserResponse updateMine(User currentUser, UpdateProfileRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable"));
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setPhone(request.getPhone());
        user.setBio(request.getBio());
        if (user.getRole() == Role.TECHNICIEN) {
            List<TechnicienExperience> experiences = request.getExperiencesPro() == null
                    ? new ArrayList<>()
                    : request.getExperiencesPro().stream()
                        .map(e -> new TechnicienExperience(e.getSociete(), e.getPeriode()))
                        .collect(Collectors.toList());
            user.setDateNaissance(request.getDateNaissance());
            user.setCin(request.getCin());
            user.setNomParent(request.getNomParent());
            user.setAdresse(request.getAdresse());
            user.setGsmParent(request.getGsmParent());
            user.setGsmBinome(request.getGsmBinome());
            user.setFacebook(request.getFacebook());
            user.setTiktok(request.getTiktok());
            user.setInstagram(request.getInstagram());
            user.setDiplome(request.getDiplome());
            user.setSpecialite(request.getSpecialite());
            user.setNiveauScolaire(request.getNiveauScolaire());
            user.setPermisConduire(request.getPermisConduire());
            user.setTypeContrat(request.getTypeContrat());
            user.setNumCnss(request.getNumCnss());
            user.setNumD17(request.getNumD17());
            user.setNumeroBanque(request.getNumeroBanque());
            user.setGroupeSanguin(request.getGroupeSanguin());
            user.setPoids(request.getPoids());
            user.setHauteur(request.getHauteur());
            user.setPointureChaussure(request.getPointureChaussure());
            user.setTailleVetements(request.getTailleVetements());
            user.setTatouage(request.getTatouage());
            user.setMaladiesChroniques(request.getMaladiesChroniques());
            user.setAllergies(request.getAllergies());
            user.setOperations(request.getOperations());
            user.setDateEmbauche(request.getDateEmbauche());
            user.setExperienceAnnees(request.getExperienceAnnees());
            user.setSalaireDepart(request.getSalaireDepart());
            user.setJoursCongeAutorises(request.getJoursCongeAutorises());
            user.setGsmSocieteMSD(request.getGsmSocieteMSD());
            user.setExperiencesPro(experiences);
        } else if (user.getRole() == Role.ENTREPRISE) {
            user.setRaisonSociale(request.getRaisonSociale());
            user.setMatriculeFiscal(request.getMatriculeFiscal());
            user.setRegistreCommerce(request.getRegistreCommerce());
            user.setSecteurActivite(request.getSecteurActivite());
            user.setDescriptionEntreprise(request.getDescriptionEntreprise());
            user.setAnneeCreation(request.getAnneeCreation());
            user.setTailleEntreprise(request.getTailleEntreprise());
            user.setEntrepriseAdresse(request.getEntrepriseAdresse());
            user.setGouvernorat(request.getGouvernorat());
            user.setVille(request.getVille());
            user.setEntrepriseTelephone(request.getEntrepriseTelephone());
            user.setEntrepriseEmail(request.getEntrepriseEmail());
            user.setSiteWeb(request.getSiteWeb());
            user.setLinkedin(request.getLinkedin());
            user.setNomResponsable(request.getNomResponsable());
            user.setFonctionResponsable(request.getFonctionResponsable());
            user.setTelephoneResponsable(request.getTelephoneResponsable());
            user.setEmailResponsable(request.getEmailResponsable());
            user.setDomainesActivite(request.getDomainesActivite());
            user.setTechnologiesUtilisees(request.getTechnologiesUtilisees());
            user.setServicesProposes(request.getServicesProposes());
            user.setNombreTechniciens(request.getNombreTechniciens());
            user.setNombreStagiaires(request.getNombreStagiaires());
            user.setNombreEmployes(request.getNombreEmployes());
        } else if (user.getRole() == Role.CENTRE_FORMATION) {
            user.setAdresse(request.getAdresse());
            user.setSiteWeb(request.getSiteWeb());
            user.setHoraires(request.getHoraires());
            user.setFormationsProposees(request.getFormationsProposees());
        } else if (user.getRole() == Role.EXPERT_JURIDIQUE) {
            user.setAdresse(request.getAdresse());
            user.setDiplome(request.getDiplome());
        }
        userRepository.save(user);
        return userMapper.toResponse(user);
    }
    @Transactional
    public UserResponse updatePhotoProfil(User currentUser, MultipartFile file) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable"));
        if (user.getPhotoProfilPath() != null) {
            fileStorageService.deleteImage(user.getPhotoProfilPath());
        }
        user.setPhotoProfilPath(fileStorageService.storeImage(file));
        userRepository.save(user);
        return userMapper.toResponse(user);
    }
    @Transactional
    public UserResponse updatePhotoCouverture(User currentUser, MultipartFile file) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable"));
        if (user.getPhotoCouverturePath() != null) {
            fileStorageService.deleteImage(user.getPhotoCouverturePath());
        }
        user.setPhotoCouverturePath(fileStorageService.storeImage(file));
        userRepository.save(user);
        return userMapper.toResponse(user);
    }
    @Transactional
    public UserResponse updateDiplomeDocument(User currentUser, MultipartFile file) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable"));
        if (user.getDiplomeDocumentPath() != null) {
            fileStorageService.deleteImage(user.getDiplomeDocumentPath());
        }
        user.setDiplomeDocumentPath(fileStorageService.storeImage(file));
        userRepository.save(user);
        return userMapper.toResponse(user);
    }
}