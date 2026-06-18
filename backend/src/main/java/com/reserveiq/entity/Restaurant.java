package com.reserveiq.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Restaurant Entity matching the 'restaurants' table in MySQL.
 * 
 * Explanations of Relationships:
 * - ManyToOne with User (Manager): Many restaurants can be managed by one manager.
 * - OneToMany with RestaurantTable: A restaurant owns many tables. If a restaurant is deleted, its tables are cascaded.
 * - OneToMany with Reservation: A restaurant has many reservations.
 * - OneToMany with Review: A restaurant has many customer reviews.
 */
@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String cuisine;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "opening_time", nullable = false)
    private LocalTime openingTime;

    @Column(name = "closing_time", nullable = false)
    private LocalTime closingTime;

    @Column(name = "image_url")
    private String imageUrl;

    /**
     * The manager assigned to manage this restaurant.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RestaurantTable> tables = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();
}
