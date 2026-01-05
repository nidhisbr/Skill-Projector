package com.example.Skill.projector.controller;

import com.example.Skill.projector.dto.LoginRequest;
import com.example.Skill.projector.dto.SignupRequest;
import com.example.Skill.projector.jwt.JwtTokenService;
import com.example.Skill.projector.dto.AuthResponse;
import com.example.Skill.projector.model.User;
import com.example.Skill.projector.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    public AuthController(UserRepository userRepository, 
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          JwtTokenService jwtTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenService = jwtTokenService;
    }

    // ----------------------- SIGNUP --------------------------
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest req) {

        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "Email and password are required"));
        }

        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new AuthResponse(false, "Email already registered"));
        }

        String hashedPassword = passwordEncoder.encode(req.getPassword());
        String role = req.getRole() != null ? req.getRole() : "submitter";
        int level = req.getLevel() != null ? req.getLevel() : 1;

        User user = new User(
                req.getEmpid(),
                req.getEmail(),
                hashedPassword,
                role,
                level
        );

        User saved = userRepository.save(user);

        try {
            // Authenticate newly created user (use raw password)
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword());

            Authentication auth = authenticationManager.authenticate(authToken);

            // Create RS256 JWT using your service method that accepts Authentication
            String token = jwtTokenService.createToken(auth);

            // Return token in response
            return ResponseEntity.ok(new AuthResponse(true, "User registered and logged in", token));
        } catch (AuthenticationException ex) {
            // If auth fails, still return created but without token
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AuthResponse(true, "User created but auto-login failed"));
        }
    }
    // ----------------------- LOGIN --------------------------
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        try {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            req.getEmail(),
                            req.getPassword()
                    );

            Authentication auth = authenticationManager.authenticate(authToken);

            // ✅ CREATE JWT
            String token = jwtTokenService.createToken(auth);

            return ResponseEntity.ok(
                    new AuthResponse(true, "Login successful", token)
            );
        }
        catch (AuthenticationException ex) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(false, "Invalid email or password"));
        }
    }
}

