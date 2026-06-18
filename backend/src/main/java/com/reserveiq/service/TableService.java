package com.reserveiq.service;

import com.reserveiq.dto.RestaurantTableDTO;

import java.util.List;

public interface TableService {

    List<RestaurantTableDTO> getTablesByRestaurant(Long restaurantId);

    RestaurantTableDTO createTable(RestaurantTableDTO dto);

    RestaurantTableDTO updateTable(Long id, RestaurantTableDTO dto);

    void deleteTable(Long id);
}
