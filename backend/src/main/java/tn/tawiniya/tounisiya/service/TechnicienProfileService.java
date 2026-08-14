package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.dto.TechnicienProfileRequest;
import tn.tawiniya.tounisiya.dto.TechnicienProfileResponse;
import tn.tawiniya.tounisiya.entity.TechnicienProfile;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.TechnicienProfileRepository;
@Service
@RequiredArgsConstructor
public class TechnicienProfileService {
    private final TechnicienProfileRepository profileRepository;
    private final FileStorageService fileStorageService;
    @Transactional(readOnly = true)
    public TechnicienProfileResponse getMine(User user) {
        TechnicienProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun profil trouvé pour cet utilisateur."));
        return TechnicienProfileResponse.from(profile);
    }
    @Transactional(readOnly = true)
    public boolean hasProfile(User user) {
        return profileRepository.findByUser(user).isPresent();
    }
    @Transactional
    public TechnicienProfileResponse createOrUpdate(User user, TechnicienProfileRequest req) {
        TechnicienProfile profile = profileRepository.findByUser(user).orElse(
                TechnicienProfile.builder().user(user).build()
        );
        profile.setNom(req.getNom());
        profile.setPrenom(req.getPrenom());
        profile.setDateNaissance(req.getDateNaissance());
        profile.setCin(req.getCin());
        profile.setNomParent(req.getNomParent());
        profile.setAdresse(req.getAdresse());
        profile.setGsm(req.getGsm());
        profile.setGsmParent(req.getGsmParent());
        profile.setGsmBinome(req.getGsmBinome());
        profile.setEmail(req.getEmail());
        profile.setFacebook(req.getFacebook());
        profile.setTiktok(req.getTiktok());
        profile.setInstagram(req.getInstagram());
        profile.setDiplome(req.getDiplome());
        profile.setSpecialite(req.getSpecialite());
        profile.setNiveauScolaire(req.getNiveauScolaire());
        profile.setPermisConduite(req.isPermisConduite());
        profile.setDatePermis(req.getDatePermis());
        profile.setTypeContrat(req.getTypeContrat());
        profile.setNumeroCnss(req.getNumeroCnss());
        profile.setNumeroD17(req.getNumeroD17());
        profile.setNumeroBanquePoste(req.getNumeroBanquePoste());
        profile.setGroupeSanguin(req.getGroupeSanguin());
        profile.setPoidsKg(req.getPoidsKg());
        profile.setHauteurCm(req.getHauteurCm());
        profile.setPointureChaussure(req.getPointureChaussure());
        profile.setTailleVetements(req.getTailleVetements());
        profile.setMaladiesChroniques(req.getMaladiesChroniques());
        profile.setAllergies(req.getAllergies());
        profile.setOperations(req.getOperations());
        profile.setTatouage(req.isTatouage());
        profile.setDateEmbauche(req.getDateEmbauche());
        profile.setExperience(req.getExperience());
        profile.setSocietesEtPeriodes(req.getSocietesEtPeriodes());
        profile.setSalaireDepart(req.getSalaireDepart());
        profile.setNombreJoursConge(req.getNombreJoursConge());
        profile.setGsmSociete(req.getGsmSociete());
        profileRepository.save(profile);
        return TechnicienProfileResponse.from(profile);
    }
    @Transactional
    public TechnicienProfileResponse updatePhotoProfil(User user, MultipartFile file) {
        TechnicienProfile profile = getOrCreateProfile(user);
        if (profile.getPhotoProfilPath() != null) {
            fileStorageService.deleteImage(profile.getPhotoProfilPath());
        }
        profile.setPhotoProfilPath(fileStorageService.storeTechnicienPhoto(file));
        profileRepository.save(profile);
        return TechnicienProfileResponse.from(profile);
    }
    @Transactional
    public TechnicienProfileResponse updatePhotoCouverture(User user, MultipartFile file) {
        TechnicienProfile profile = getOrCreateProfile(user);
        if (profile.getPhotoCouverturePath() != null) {
            fileStorageService.deleteImage(profile.getPhotoCouverturePath());
        }
        profile.setPhotoCouverturePath(fileStorageService.storeTechnicienPhoto(file));
        profileRepository.save(profile);
        return TechnicienProfileResponse.from(profile);
    }
    @Transactional
    public TechnicienProfileResponse updateDocument(User user, String documentField, MultipartFile file) {
        TechnicienProfile profile = getOrCreateProfile(user);
        String path = fileStorageService.storeTechnicienDocument(file);
        switch (documentField) {
            case "cin" -> profile.setCopieCinPath(path);
            case "extraitNaissance" -> profile.setCopieExtraitNaissancePath(path);
            case "diplome" -> profile.setCopieDiplomePath(path);
            case "permis" -> profile.setCopiePermisPath(path);
            default -> throw new IllegalArgumentException("Type de document inconnu : " + documentField);
        }
        profileRepository.save(profile);
        return TechnicienProfileResponse.from(profile);
    }
    /** Admin : tous les profils techniciens. */
    @Transactional(readOnly = true)
    public Page<TechnicienProfileResponse> listAll(Pageable pageable) {
        return profileRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(TechnicienProfileResponse::from);
    }
    private TechnicienProfile getOrCreateProfile(User user) {
        return profileRepository.findByUser(user).orElseGet(() -> {
            TechnicienProfile p = TechnicienProfile.builder().user(user).build();
            return profileRepository.save(p);
        });
    }
}