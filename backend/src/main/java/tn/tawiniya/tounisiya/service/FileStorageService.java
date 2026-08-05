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
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5 Mo

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    /**
     * Sauvegarde un fichier image sur le disque et renvoie son chemin public (ex: /uploads/images/xxx.jpg).
     */
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

    /** Supprime le fichier physique correspondant à un chemin public (best-effort, n'échoue pas si absent). */
    public void deleteImage(String publicPath) {
        try {
            String relative = publicPath.replaceFirst("^/uploads/", "");
            Path target = Paths.get(uploadDir, relative);
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // Suppression best-effort : on ne bloque pas la suppression en base si le fichier physique manque déjà.
        }
    }

    private String getExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return "";
        }
        return originalFilename.substring(originalFilename.lastIndexOf('.'));
    }

    // Formats acceptés exposés pour référence côté front si besoin.
    public List<String> allowedTypes() {
        return List.copyOf(ALLOWED_TYPES);
    }
}
