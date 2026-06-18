package com.reserveiq.dto;

import com.reserveiq.entity.TableStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * DTO for RestaurantTable operations.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTableDTO {
    private Long id;

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    @NotNull(message = "Table number is required")
    @Min(value = 1, message = "Table number must be positive")
    private Integer tableNumber;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private TableStatus status;
}
