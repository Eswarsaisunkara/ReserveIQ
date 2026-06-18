package com.reserveiq.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Reservation Entity matching the 'reservations' table in MySQL.
 * 
 * Explanations of Relationships:
 * - ManyToOne with User: The customer who booked the table.
 * - ManyToOne with RestaurantTable: The table reserved.
 * - ManyToOne with Restaurant: The restaurant where the reservation takes place.
 */
@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    private RestaurantTable table;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    @Column(name = "reservation_time", nullable = false)
    private LocalTime reservationTime;

    @Column(name = "guest_count", nullable = false)
    private Integer guestCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
