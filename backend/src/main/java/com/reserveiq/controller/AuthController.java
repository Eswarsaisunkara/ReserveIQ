package com.reserveiq.controller;

import com.reserveiq.dto.AuthRequest;
import com.reserveiq.dto.AuthResponse;
import com.reserveiq.dto.RegisterRequest;
import com.reserveiq.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for open authentication operations (Registration and Login).
 */
@Tag(name = "Authentication", description = "Endpoints for new user sign-up and JWT token issuance")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Register a new customer account.
     */
    @Operation(summary = "Register new account", description = "Creates a new User with CUSTOMER role and issues a JWT token")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    /**
     * POST /api/auth/login
     * Authenticate user credentials and return a JWT token.
     */
    @Operation(summary = "User Login", description = "Validates user email and password, returning user info alongside a signed 24h JWT token")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
