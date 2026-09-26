package tn.tawiniya.tounisiya.service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.tawiniya.tounisiya.entity.PasswordResetToken;
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.exception.InvalidFileException;
import tn.tawiniya.tounisiya.exception.ResourceNotFoundException;
import tn.tawiniya.tounisiya.repository.PasswordResetTokenRepository;
import tn.tawiniya.tounisiya.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;
    private static final long EXPIRATION_MINUTES = 60;
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        // Ne pas reveler si l'email existe ou non (securite) : on ne leve pas d'erreur ici.
        if (user == null) {
            return;
        }
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES))
                .used(false)
                .build();
        tokenRepository.save(resetToken);
        sendResetEmail(user, token);
    }
    private void sendResetEmail(User user, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Reinitialisation de votre mot de passe - Tawiniya Tounisiya");
        message.setText(
                "Bonjour " + user.getPrenom() + ",\n\n" +
                "Vous avez demande la reinitialisation de votre mot de passe.\n" +
                "Cliquez sur le lien suivant pour choisir un nouveau mot de passe (valable 1 heure) :\n\n" +
                resetLink + "\n\n" +
                "Si vous n'etes pas a l'origine de cette demande, ignorez cet email.\n\n" +
                "L'equipe CTTEERA"
        );
        mailSender.send(message);
    }
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Lien de reinitialisation invalide."));
        if (resetToken.isUsed()) {
            throw new InvalidFileException("Ce lien de reinitialisation a deja ete utilise.");
        }
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new InvalidFileException("Ce lien de reinitialisation a expire.");
        }
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}