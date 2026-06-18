package com.reserveiq.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalTime;

/**
 * Restaurant DTO used for Create, Update, and Output representations.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantDTO {
    private Long id;

    @NotBlank(message = "Restaurant name is required")
    private String name;

    private String description;

    @NotBlank(message = "Cuisine type is required")
    private String cuisine;

    @NotBlank(message = "Address is required")
    private String address;

    private String phoneNumber;

    @NotNull(message = "Opening time is required")
    private LocalTime openingTime;

    @NotNull(message = "Closing time is required")
    private LocalTime closingTime;

    private String imageUrl;

    private Long managerId;

    private Double averageRating;
}
