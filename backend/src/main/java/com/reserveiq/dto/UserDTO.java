package com.reserveiq.dto;

import com.reserveiq.entity.Role;
import lombok.*;

import java.time.LocalDateTime;

/**
 * User DTO used when returning user details (e.g., in Admin lists),
 * masking sensitive data like passwords.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String phone;
    private LocalDateTime createdAt;
}
