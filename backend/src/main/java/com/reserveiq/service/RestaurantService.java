package com.reserveiq.service;

import com.reserveiq.dto.RestaurantDTO;

import java.util.List;

/**
 * Service handling Restaurant listings.
 */
public interface RestaurantService {

    List<RestaurantDTO> getAllRestaurants(String search, String cuisine);

    RestaurantDTO getRestaurantById(Long id);

    RestaurantDTO createRestaurant(RestaurantDTO dto);

    RestaurantDTO updateRestaurant(Long id, RestaurantDTO dto);

    void deleteRestaurant(Long id);

    List<RestaurantDTO> getRestaurantsByManager(Long managerId);
}
