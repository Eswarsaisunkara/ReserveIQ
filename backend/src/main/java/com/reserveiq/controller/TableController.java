package com.reserveiq.controller;

import com.reserveiq.dto.RestaurantTableDTO;
import com.reserveiq.service.TableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Restaurant Tables", description = "Endpoints for viewing and configuring restaurant table layouts")
@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @Operation(summary = "Get tables by Restaurant", description = "Public endpoint to inspect available tables for a restaurant")
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<RestaurantTableDTO>> getTablesByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(tableService.getTablesByRestaurant(restaurantId));
    }

    @Operation(summary = "Create table", description = "Configure a new table for a restaurant. Requires MANAGER role")
    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public ResponseEntity<RestaurantTableDTO> createTable(@Valid @RequestBody RestaurantTableDTO dto) {
        return new ResponseEntity<>(tableService.createTable(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Update table", description = "Modify capacity or status (e.g. MAINTENANCE). Requires MANAGER role")
    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}")
    public ResponseEntity<RestaurantTableDTO> updateTable(@PathVariable Long id, @Valid @RequestBody RestaurantTableDTO dto) {
        return ResponseEntity.ok(tableService.updateTable(id, dto));
    }

    @Operation(summary = "Delete table", description = "Remove table configuration. Requires MANAGER role")
    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }
}
