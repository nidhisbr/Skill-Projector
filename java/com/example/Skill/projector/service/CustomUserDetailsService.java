package com.example.Skill.projector.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.Skill.projector.model.User;
import com.example.Skill.projector.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    // Here we treat "username" as email.
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> opt = userRepository.findByEmail(email);
        User appUser = opt.orElseThrow(() ->
            new UsernameNotFoundException("User not found with email: " + email)
        );

        String role = appUser.getRole() == null || appUser.getRole().isBlank()
                ? "USER"
                : appUser.getRole();

        // Build a Spring Security UserDetails object
        return org.springframework.security.core.userdetails.User
                .withUsername(appUser.getEmail())
                .password(appUser.getPassword()) // this is the hashed password from DB
                .authorities(role)               // simple role string
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
