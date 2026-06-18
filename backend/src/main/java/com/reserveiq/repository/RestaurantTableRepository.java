package com.reserveiq.repository;

import com.reserveiq.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for RestaurantTable entity.
 */
@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {

    /**
     * Find all tables belonging to a specific restaurant.
     * 
     * @param restaurantId ID of the restaurant
     * @return List of tables
     */
    List<RestaurantTable> findByRestaurantId(Long restaurantId);
}
