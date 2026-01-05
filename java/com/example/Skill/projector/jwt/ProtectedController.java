package com.example.Skill.projector.jwt;

import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/protected")
public class ProtectedController {

    // returns a simple message including the JWT subject (username/email)
    @GetMapping("/hello")
    public Map<String,String> hello(@AuthenticationPrincipal Jwt jwt) {
        String subject = jwt.getSubject(); // the 'sub' claim (username/email)
        String scope = jwt.getClaimAsString("scope"); // authorities we put earlier
        String username = subject.split("@")[0];
        
        return Map.of(
        		
        		"username",username)
        		;
    }
}