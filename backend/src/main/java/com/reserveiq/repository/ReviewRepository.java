package com.reserveiq.repository;

import com.reserveiq.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Review entity.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Find all reviews for a specific restaurant.
     * 
     * @param restaurantId restaurant's ID
     * @return List of reviews
     */
    List<Review> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);

    /**
     * Check if a specific user has already reviewed a specific restaurant.
     * 
     * @param userId customer's ID
     * @param restaurantId restaurant's ID
     * @return true if review exists
     */
    boolean existsByUserIdAndRestaurantId(Long userId, Long restaurantId);
}
