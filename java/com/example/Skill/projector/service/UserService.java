package com.example.Skill.projector.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Skill.projector.model.User;
import com.example.Skill.projector.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Signup: save user with hashed password
    public String registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "EMAIL_EXISTS";
        }
        if (userRepository.existsByEmpid(user.getEmpid())) {
            return "EMPID_EXISTS";
        }
        // hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "OK";
    }

   
    public boolean validateCredentials(String email, String rawPassword) {
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) return false;
        String storedHash = opt.get().getPassword();
        return passwordEncoder.matches(rawPassword, storedHash);
    }
}