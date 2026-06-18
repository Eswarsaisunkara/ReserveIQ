package com.reserveiq.repository;

import com.reserveiq.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Restaurant entity.
 */
@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    /**
     * Search restaurants matching term in name, cuisine, or address.
     * 
     * @param name search term for name
     * @param cuisine search term for cuisine
     * @param address search term for address
     * @return List of matching restaurants
     */
    List<Restaurant> findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCaseOrAddressContainingIgnoreCase(
            String name, String cuisine, String address);

    /**
     * Find all restaurants by cuisine type.
     * 
     * @param cuisine cuisine type
     * @return List of restaurants
     */
    List<Restaurant> findByCuisineIgnoreCase(String cuisine);

    /**
     * Find all restaurants managed by a specific manager ID.
     * 
     * @param managerId ID of the manager
     * @return List of restaurants
     */
    List<Restaurant> findByManagerId(Long managerId);
}
