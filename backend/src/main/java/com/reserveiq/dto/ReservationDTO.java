package com.reserveiq.dto;

import com.reserveiq.entity.ReservationStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Reservation DTO for input and output operations.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationDTO {
    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Table ID is required")
    private Long tableId;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private String restaurantName;
    private String restaurantImage;
    private Integer tableNumber;
    private String customerName;
    private String customerEmail;

    @NotNull(message = "Reservation date is required")
    @FutureOrPresent(message = "Reservation date cannot be in the past")
    private LocalDate reservationDate;

    @NotNull(message = "Reservation time is required")
    private LocalTime reservationTime;

    @NotNull(message = "Guest count is required")
    @Min(value = 1, message = "Guest count must be at least 1")
    private Integer guestCount;

    private ReservationStatus status;

    private String specialRequests;

    private LocalDateTime createdAt;
}
