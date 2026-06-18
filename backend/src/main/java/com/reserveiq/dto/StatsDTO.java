package com.reserveiq.dto;

import lombok.*;

/**
 * Platform statistics DTO for the Admin Dashboard.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsDTO {
    private long totalUsers;
    private long customers;
    private long managers;
    private long totalRestaurants;
    private long totalReservations;
    private long pendingReservations;
    private long confirmedReservations;
    private long totalReviews;
}
