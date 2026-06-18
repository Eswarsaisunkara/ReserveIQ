package com.reserveiq.repository;

import com.reserveiq.entity.Reservation;
import com.reserveiq.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Reservation entity.
 */
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /**
     * Find all reservations for a specific customer.
     * 
     * @param userId customer's ID
     * @return List of reservations
     */
    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Find all reservations for a specific restaurant.
     * 
     * @param restaurantId ID of the restaurant
     * @return List of reservations
     */
    List<Reservation> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    /**
     * Find reservations by their status.
     * 
     * @param status ReservationStatus
     * @return List of reservations
     */
    List<Reservation> findByStatusOrderByCreatedAtDesc(ReservationStatus status);
}
