package com.reserveiq.controller;

import com.reserveiq.dto.RestaurantDTO;
import com.reserveiq.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Restaurants", description = "Endpoints for restaurant discovery, search, and management")
@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @Operation(summary = "Get all restaurants", description = "Fetch listings, optionally filtered by search query or cuisine")
    @GetMapping
    public ResponseEntity<List<RestaurantDTO>> getAllRestaurants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "All") String cuisine) {
        return ResponseEntity.ok(restaurantService.getAllRestaurants(search, cuisine));
    }

    @Operation(summary = "Get restaurant by ID", description = "Fetch single restaurant details including hours and cuisine")
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDTO> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @Operation(summary = "Create restaurant", description = "Add a new restaurant listing. Requires MANAGER or ADMIN role")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @PostMapping
    public ResponseEntity<RestaurantDTO> createRestaurant(@Valid @RequestBody RestaurantDTO dto) {
        return new ResponseEntity<>(restaurantService.createRestaurant(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Update restaurant", description = "Update an existing listing. Requires MANAGER or ADMIN role")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<RestaurantDTO> updateRestaurant(@PathVariable Long id, @Valid @RequestBody RestaurantDTO dto) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, dto));
    }

    @Operation(summary = "Delete restaurant", description = "Remove a listing permanently. Requires MANAGER or ADMIN role")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }
}
