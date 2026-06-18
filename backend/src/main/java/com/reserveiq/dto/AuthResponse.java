package com.reserveiq.dto;

import com.reserveiq.entity.Role;
import lombok.*;

/**
 * Response DTO returned upon successful authentication.
 * 
 * Postman Example Response JSON:
 * {
 *   "id": 1,
 *   "fullName": "John Customer",
 *   "email": "john@example.com",
 *   "role": "CUSTOMER",
 *   "phone": "+1-555-0101",
 *   "token": "eyJhbGciOiJIUzI1NiJ9..."
 * }
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String phone;
    private String token;
}
