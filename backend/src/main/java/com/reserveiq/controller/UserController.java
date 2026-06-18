package com.reserveiq.controller;

import com.reserveiq.dto.StatsDTO;
import com.reserveiq.dto.UserDTO;
import com.reserveiq.entity.Role;
import com.reserveiq.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Users & Admin", description = "Endpoints for managing users and viewing platform analytics")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "Get all users", description = "Fetch all registered platform users. Requires ADMIN role")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary = "Update user role", description = "Promote or demote a user (e.g., CUSTOMER to MANAGER). Requires ADMIN role")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable Long id, @RequestParam Role role) {
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }

    @Operation(summary = "Delete user", description = "Permanently remove a user from the platform. Requires ADMIN role")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get platform analytics", description = "Fetch comprehensive statistics for the Admin Dashboard. Requires ADMIN role")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<StatsDTO> getPlatformStats() {
        return ResponseEntity.ok(userService.getPlatformStats());
    }
}
