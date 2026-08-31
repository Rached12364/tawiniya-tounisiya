package tn.tawiniya.tounisiya.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.tawiniya.tounisiya.exception.InvalidFileException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;
@Service
public class FileStorageService {
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final Set<String> ALLOWED_ATTACHMENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "application/pdf");
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5 Mo
    private static final Set<String> ALLOWED_VIDEO_TYPES = Set.of("video/mp4", "video/webm", "video/ogg");
    private static final long MAX_VIDEO_SIZE_BYTES = 100L * 1024 * 1024; // 100 Mo
    private static final Set<String> ALLOWED_AUDIO_TYPES = Set.of("audio/webm", "audio/ogg", "audio/mpeg", "audio/mp4", "audio/wav");
    private static final Set<String> ALLOWED_MESSAGE_ATTACHMENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "application/pdf",
            "video/mp4", "video/webm", "video/ogg",
            "audio/webm", "audio/ogg", "audio/mpeg", "audio/mp4", "audio/wav");
    @Value("${app.upload-dir:uploads}")
    private String uploadDir;
    public String storeImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("Le fichier est vide.");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Format non autorisé. Formats acceptés : JPG, PNG, WEBP.");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new InvalidFileException("Le fichier dépasse la taille maximale de 5 Mo.");
        }
        try {
            Path targetDir = Paths.get(uploadDir, "images");
            Files.createDirectories(targetDir);
            String extension = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;
            Path targetPath = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/images/" + filename;
        } catch (IOException e) {
            throw new InvalidFileException("Erreur lors de l'enregistrement du fichier.");
        }
    }
    public void deleteImage(String publicPath) {
        if (publicPath == null) return;
        try {
            String relative = publicPath.replaceFirst("^/uploads/", "");
            Path target = Paths.get(uploadDir, relative);
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
        }
    }
    public String storeAttachment(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        if (!ALLOWED_ATTACHMENT_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Format non autorisé. Formats acceptés : JPG, PNG, WEBP, PDF.");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new InvalidFileException("Le fichier dépasse la taille maximale de 5 Mo.");
        }
        try {
            Path targetDir = Paths.get(uploadDir, "reclamations");
            Files.createDirectories(targetDir);
            String extension = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;
            Path targetPath = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/reclamations/" + filename;
        } catch (IOException e) {
            throw new InvalidFileException("Erreur lors de l'enregistrement du fichier.");
        }
    }
    /** Photo de profil ou de couverture d'un technicien (image uniquement). */
    public String storeTechnicienPhoto(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Format non autorisé. Formats acceptés : JPG, PNG, WEBP.");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new InvalidFileException("Le fichier dépasse la taille maximale de 5 Mo.");
        }
        try {
            Path targetDir = Paths.get(uploadDir, "techniciens", "photos");
            Files.createDirectories(targetDir);
            String extension = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;
            Path targetPath = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/techniciens/photos/" + filename;
        } catch (IOException e) {
            throw new InvalidFileException("Erreur lors de l'enregistrement du fichier.");
        }
    }
    /** Document justificatif d'un technicien (CIN, diplôme, permis, extrait de naissance) : image ou PDF. */
    public String storeTechnicienDocument(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        if (!ALLOWED_ATTACHMENT_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Format non autorisé. Formats acceptés : JPG, PNG, WEBP, PDF.");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new InvalidFileException("Le fichier dépasse la taille maximale de 5 Mo.");
        }
        try {
            Path targetDir = Paths.get(uploadDir, "techniciens", "documents");
            Files.createDirectories(targetDir);
            String extension = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;
            Path targetPath = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/techniciens/documents/" + filename;
        } catch (IOException e) {
            throw new InvalidFileException("Erreur lors de l'enregistrement du fichier.");
        }
    }
    /** Video de presentation institutionnelle (page d'accueil). */
    public String storeVideo(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Le fichier est vide.");
        }
        if (!ALLOWED_VIDEO_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Format non autorise. Formats acceptes : MP4, WEBM, OGG.");
        }
        if (file.getSize() > MAX_VIDEO_SIZE_BYTES) {
            throw new InvalidFileException("Le fichier depasse la taille maximale de 100 Mo.");
        }
        try {
            Path targetDir = Paths.get(uploadDir, "videos");
            Files.createDirectories(targetDir);
            String extension = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;
            Path targetPath = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/videos/" + filename;
        } catch (IOException e) {
            throw new InvalidFileException("Erreur lors de l'enregistrement du fichier.");
        }
    }
    /** Piece jointe dans une conversation avec un expert juridique : image, PDF, video ou audio (vocal). */
    public String storeMessageAttachment(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        if (!ALLOWED_MESSAGE_ATTACHMENT_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Format non autorise. Formats acceptes : images, PDF, video (MP4/WEBM/OGG), audio.");
        }
        long maxSize = file.getContentType() != null && file.getContentType().startsWith("video/") ? MAX_VIDEO_SIZE_BYTES : MAX_SIZE_BYTES;
        if (file.getSize() > maxSize) {
            throw new InvalidFileException("Le fichier depasse la taille maximale autorisee.");
        }
        try {
            Path targetDir = Paths.get(uploadDir, "expert-messages");
            Files.createDirectories(targetDir);
            String extension = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID() + extension;
            Path targetPath = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/expert-messages/" + filename;
        } catch (IOException e) {
            throw new InvalidFileException("Erreur lors de l'enregistrement du fichier.");
        }
    }
    private String getExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return "";
        }
        return originalFilename.substring(originalFilename.lastIndexOf('.'));
    }
    public List<String> allowedTypes() {
        return List.copyOf(ALLOWED_TYPES);
    }
}