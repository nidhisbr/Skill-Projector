package com.example.Skill.projector.jwt;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenService.class);

    private final JwtEncoder jwtEncoder;
    private final long expiryMinutes = 90L;

    public JwtTokenService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String createToken(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalArgumentException("Authentication must not be null");
        }

        String scope = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plus(expiryMinutes, ChronoUnit.MINUTES))
                .subject(authentication.getName())
                .claim("scope", scope)
                .build();

        try {
            var jwt = jwtEncoder.encode(JwtEncoderParameters.from(claims));
            if (jwt == null) {
                log.error("JwtEncoder.encode(...) returned null");
                throw new IllegalStateException("JwtEncoder returned null");
            }
            String token = jwt.getTokenValue();
            if (token == null || token.isBlank()) {
                log.error("Token value is null/blank after encoding. jwt: {}", jwt);
                throw new IllegalStateException("Encoded token is null or blank");
            }
            log.info("JWT created for subject='{}' (len={})", authentication.getName(), token.length());
            return token;
        } catch (Exception e) {
            // log the error with stack trace so you can see what failed (key loading, signing, etc.)
            log.error("Failed to create JWT token: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create JWT token", e);
        }
    }

	
    
}
