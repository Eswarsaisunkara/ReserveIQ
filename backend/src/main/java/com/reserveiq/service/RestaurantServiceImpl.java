package com.reserveiq.service;

import com.reserveiq.dto.RestaurantDTO;
import com.reserveiq.entity.Restaurant;
import com.reserveiq.entity.Review;
import com.reserveiq.entity.User;
import com.reserveiq.exception.ResourceNotFoundException;
import com.reserveiq.repository.RestaurantRepository;
import com.reserveiq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantDTO> getAllRestaurants(String search, String cuisine) {
        log.info("Fetching restaurants with search='{}' and cuisine='{}'", search, cuisine);
        List<Restaurant> restaurants;

        if (search != null && !search.isBlank()) {
            restaurants = restaurantRepository.findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCaseOrAddressContainingIgnoreCase(
                    search, search, search);
        } else if (cuisine != null && !cuisine.isBlank() && !cuisine.equalsIgnoreCase("All")) {
            restaurants = restaurantRepository.findByCuisineIgnoreCase(cuisine);
        } else {
            restaurants = restaurantRepository.findAll();
        }

        return restaurants.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RestaurantDTO getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + id));
        return mapToDTO(restaurant);
    }

    @Override
    @Transactional
    public RestaurantDTO createRestaurant(RestaurantDTO dto) {
        log.info("Creating new restaurant: {}", dto.getName());
        User manager = null;
        if (dto.getManagerId() != null) {
            manager = userRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + dto.getManagerId()));
        }

        Restaurant restaurant = Restaurant.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .cuisine(dto.getCuisine())
                .address(dto.getAddress())
                .phoneNumber(dto.getPhoneNumber() != null ? dto.getPhoneNumber() : "")
                .openingTime(dto.getOpeningTime())
                .closingTime(dto.getClosingTime())
                .imageUrl(dto.getImageUrl() != null && !dto.getImageUrl().isBlank() 
                        ? dto.getImageUrl() 
                        : "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800")
                .manager(manager)
                .build();

        Restaurant saved = restaurantRepository.save(restaurant);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public RestaurantDTO updateRestaurant(Long id, RestaurantDTO dto) {
        log.info("Updating restaurant ID: {}", id);
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + id));

        restaurant.setName(dto.getName());
        restaurant.setDescription(dto.getDescription());
        restaurant.setCuisine(dto.getCuisine());
        restaurant.setAddress(dto.getAddress());
        if (dto.getPhoneNumber() != null) restaurant.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getOpeningTime() != null) restaurant.setOpeningTime(dto.getOpeningTime());
        if (dto.getClosingTime() != null) restaurant.setClosingTime(dto.getClosingTime());
        if (dto.getImageUrl() != null && !dto.getImageUrl().isBlank()) restaurant.setImageUrl(dto.getImageUrl());

        if (dto.getManagerId() != null) {
            User manager = userRepository.findById(dto.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with ID: " + dto.getManagerId()));
            restaurant.setManager(manager);
        }

        Restaurant updated = restaurantRepository.save(restaurant);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteRestaurant(Long id) {
        log.info("Deleting restaurant ID: {}", id);
        if (!restaurantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Restaurant not found with ID: " + id);
        }
        restaurantRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantDTO> getRestaurantsByManager(Long managerId) {
        log.info("Fetching restaurants for manager ID: {}", managerId);
        return restaurantRepository.findByManagerId(managerId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private RestaurantDTO mapToDTO(Restaurant r) {
        double avgRating = r.getReviews().stream()
                .mapToInt(Review::getRating)
                .average().orElse(0.0);

        return RestaurantDTO.builder()
                .id(r.getId())
                .name(r.getName())
                .description(r.getDescription())
                .cuisine(r.getCuisine())
                .address(r.getAddress())
                .phoneNumber(r.getPhoneNumber())
                .openingTime(r.getOpeningTime())
                .closingTime(r.getClosingTime())
                .imageUrl(r.getImageUrl())
                .managerId(r.getManager() != null ? r.getManager().getId() : null)
                .averageRating(avgRating)
                .build();
    }
}
