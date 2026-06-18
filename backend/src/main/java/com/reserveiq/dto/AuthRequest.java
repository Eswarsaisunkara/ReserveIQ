package com.reserveiq.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Request DTO for User Login.
 * Includes Validation annotations.
 * 
 * Postman Example Request JSON:
 * {
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email format is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
