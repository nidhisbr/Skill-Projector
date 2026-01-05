package com.example.Skill.projector.dto;

public record JwtTokenRequest(
	    String role,      // optional: UI hint (ignore on server when creating token)
	    String username,  // email or username used to authenticate
	    String password
	) {}