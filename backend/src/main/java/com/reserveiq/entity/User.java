package com.reserveiq.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * User Entity matching the 'users' table in MySQL Cloud Database.
 * 
 * Explanations of Entity Relationships:
 * - A User can have multiple Reservations (OneToMany)
 * - A User can leave multiple Reviews (OneToMany)
 * - If a User is a MANAGER, they can manage multiple Restaurants (OneToMany)
 * For beginner simplicity and clean unidirectional/bidirectional design, we place the ManyToOne relations on the child sides.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(length = 20)
    private String phone;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
