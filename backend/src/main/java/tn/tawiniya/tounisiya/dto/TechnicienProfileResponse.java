package tn.tawiniya.tounisiya.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.tawiniya.tounisiya.entity.GroupeSanguin;
import tn.tawiniya.tounisiya.entity.TechnicienProfile;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicienProfileResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String cin;
    private String nomParent;
    private String adresse;
    private String gsm;
    private String gsmParent;
    private String gsmBinome;
    private String email;
    private String facebook;
    private String tiktok;
    private String instagram;
    private String diplome;
    private String specialite;
    private String niveauScolaire;
    private boolean permisConduite;
    private LocalDate datePermis;
    private String typeContrat;
    private String numeroCnss;
    private String numeroD17;
    private String numeroBanquePoste;
    private GroupeSanguin groupeSanguin;
    private Double poidsKg;
    private Double hauteurCm;
    private String pointureChaussure;
    private String tailleVetements;
    private String maladiesChroniques;
    private String allergies;
    private String operations;
    private boolean tatouage;
    private LocalDate dateEmbauche;
    private String experience;
    private String societesEtPeriodes;
    private Double salaireDepart;
    private Integer nombreJoursConge;
    private String gsmSociete;
    private String photoProfilPath;
    private String photoCouverturePath;
    private String copieCinPath;
    private String copieExtraitNaissancePath;
    private String copieDiplomePath;
    private String copiePermisPath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public static TechnicienProfileResponse from(TechnicienProfile p) {
        return TechnicienProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .userEmail(p.getUser().getEmail())
                .nom(p.getNom())
                .prenom(p.getPrenom())
                .dateNaissance(p.getDateNaissance())
                .cin(p.getCin())
                .nomParent(p.getNomParent())
                .adresse(p.getAdresse())
                .gsm(p.getGsm())
                .gsmParent(p.getGsmParent())
                .gsmBinome(p.getGsmBinome())
                .email(p.getEmail())
                .facebook(p.getFacebook())
                .tiktok(p.getTiktok())
                .instagram(p.getInstagram())
                .diplome(p.getDiplome())
                .specialite(p.getSpecialite())
                .niveauScolaire(p.getNiveauScolaire())
                .permisConduite(p.isPermisConduite())
                .datePermis(p.getDatePermis())
                .typeContrat(p.getTypeContrat())
                .numeroCnss(p.getNumeroCnss())
                .numeroD17(p.getNumeroD17())
                .numeroBanquePoste(p.getNumeroBanquePoste())
                .groupeSanguin(p.getGroupeSanguin())
                .poidsKg(p.getPoidsKg())
                .hauteurCm(p.getHauteurCm())
                .pointureChaussure(p.getPointureChaussure())
                .tailleVetements(p.getTailleVetements())
                .maladiesChroniques(p.getMaladiesChroniques())
                .allergies(p.getAllergies())
                .operations(p.getOperations())
                .tatouage(p.isTatouage())
                .dateEmbauche(p.getDateEmbauche())
                .experience(p.getExperience())
                .societesEtPeriodes(p.getSocietesEtPeriodes())
                .salaireDepart(p.getSalaireDepart())
                .nombreJoursConge(p.getNombreJoursConge())
                .gsmSociete(p.getGsmSociete())
                .photoProfilPath(p.getPhotoProfilPath())
                .photoCouverturePath(p.getPhotoCouverturePath())
                .copieCinPath(p.getCopieCinPath())
                .copieExtraitNaissancePath(p.getCopieExtraitNaissancePath())
                .copieDiplomePath(p.getCopieDiplomePath())
                .copiePermisPath(p.getCopiePermisPath())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}