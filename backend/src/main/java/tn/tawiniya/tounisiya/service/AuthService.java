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
import tn.tawiniya.tounisiya.entity.User;
import tn.tawiniya.tounisiya.exception.EmailAlreadyExistsException;
import tn.tawiniya.tounisiya.repository.UserRepository;
import tn.tawiniya.tounisiya.security.JwtService;

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

        User user = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .enabled(true)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, userMapper.toResponse(user));
    }

    public AuthResponse login(LoginRequest request) {
        try {
            // Lève AuthenticationException (-> 401 via GlobalExceptionHandler) si email/mot de passe incorrect
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException ex) {
            // TASK-B003 : on enregistre la tentative échouée (transaction indépendante,
            // garantie même si l'exception provoque un rollback plus haut)
            User possibleUser = userRepository.findByEmail(request.getEmail()).orElse(null);
            loginAuditService.record(request.getEmail(), possibleUser, false, httpServletRequest);
            throw ex;
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("Utilisateur introuvable après authentification"));

        // TASK-B003 : on enregistre la tentative réussie
        loginAuditService.record(request.getEmail(), user, true, httpServletRequest);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, userMapper.toResponse(user));
    }
}
