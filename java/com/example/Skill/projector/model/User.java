package com.example.Skill.projector.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_user")
public class User {

    @Id
    @Column(name = "empid", nullable = false, unique = true)
    private String empid;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String role;
    private Integer  level;

    // Required by JPA
    public User() {}

    // Correct constructor
    public User(String empid, String email, String password, String role, Integer  level) {
        this.empid = empid;
        this.email = email;
        this.password = password;
        this.role = role;
        this.level = level;
    }

    // Getters & setters
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getEmpid() { return empid; }
    public void setEmpid(String empid) { this.empid = empid; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}