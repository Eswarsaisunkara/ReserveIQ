package com.reserveiq.service;

import com.reserveiq.dto.AuthRequest;
import com.reserveiq.dto.AuthResponse;
import com.reserveiq.dto.RegisterRequest;

/**
 * Service handling user registration and login operations.
 */
public interface AuthService {

    /**
     * Authenticate user with credentials and return a signed JWT token.
     */
    AuthResponse login(AuthRequest request);

    /**
     * Register a new user in the system.
     */
    AuthResponse register(RegisterRequest request);
}
