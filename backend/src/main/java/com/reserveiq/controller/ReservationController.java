package com.reserveiq.controller;

import com.reserveiq.dto.ReservationDTO;
import com.reserveiq.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Reservations", description = "Endpoints for booking tables and managing reservations")
@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @Operation(summary = "Book a table", description = "Submit a table reservation request. Returns status PENDING")
    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@Valid @RequestBody ReservationDTO dto) {
        return new ResponseEntity<>(reservationService.createReservation(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Get all reservations", description = "View all bookings across the platform. Requires MANAGER or ADMIN role")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @Operation(summary = "Get my reservations", description = "Fetch past and upcoming bookings for the logged-in user")
    @GetMapping("/my")
    public ResponseEntity<List<ReservationDTO>> getMyReservations(@RequestParam Long userId) {
        return ResponseEntity.ok(reservationService.getMyReservations(userId));
    }

    @Operation(summary = "Cancel reservation", description = "Cancel a PENDING or CONFIRMED booking")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Approve reservation", description = "Approve an incoming booking request. Requires MANAGER role")
    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<ReservationDTO> approveReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.approveReservation(id));
    }

    @Operation(summary = "Reject reservation", description = "Reject an incoming booking request. Requires MANAGER role")
    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<ReservationDTO> rejectReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.rejectReservation(id));
    }
}
