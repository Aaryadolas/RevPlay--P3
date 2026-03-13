package com.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.user.dto.AuthResponse;
import com.user.dto.LoginRequest;
import com.user.dto.RegisterRequest;
import com.user.dto.UpdateProfileRequest;
import com.user.dto.UserResponse;
import com.user.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Register as USER - role automatically USER
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(
            @Valid @RequestBody RegisterRequest request) {
        request.setRole("USER");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.register(request));
    }

    // Register as ARTIST - role automatically ARTIST
    @PostMapping("/register/artist")
    public ResponseEntity<AuthResponse> registerArtist(
            @Valid @RequestBody RegisterRequest request) {
        request.setRole("ARTIST");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.register(request));
    }

    // Login - works for both USER and ARTIST
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Update profile
    @PutMapping("/{id}/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(
                userService.updateProfile(id, request));
    }
}