package com.reserveiq.service;

import com.reserveiq.dto.RestaurantTableDTO;
import com.reserveiq.entity.Restaurant;
import com.reserveiq.entity.RestaurantTable;
import com.reserveiq.entity.TableStatus;
import com.reserveiq.exception.ResourceNotFoundException;
import com.reserveiq.repository.RestaurantRepository;
import com.reserveiq.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TableServiceImpl implements TableService {

    private final RestaurantTableRepository tableRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantTableDTO> getTablesByRestaurant(Long restaurantId) {
        return tableRepository.findByRestaurantId(restaurantId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RestaurantTableDTO createTable(RestaurantTableDTO dto) {
        log.info("Creating new table #{} for restaurant ID: {}", dto.getTableNumber(), dto.getRestaurantId());
        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + dto.getRestaurantId()));

        RestaurantTable table = RestaurantTable.builder()
                .restaurant(restaurant)
                .tableNumber(dto.getTableNumber())
                .capacity(dto.getCapacity())
                .status(dto.getStatus() != null ? dto.getStatus() : TableStatus.AVAILABLE)
                .build();

        RestaurantTable saved = tableRepository.save(table);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public RestaurantTableDTO updateTable(Long id, RestaurantTableDTO dto) {
        log.info("Updating table ID: {}", id);
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with ID: " + id));

        if (dto.getTableNumber() != null) table.setTableNumber(dto.getTableNumber());
        if (dto.getCapacity() != null) table.setCapacity(dto.getCapacity());
        if (dto.getStatus() != null) table.setStatus(dto.getStatus());

        RestaurantTable updated = tableRepository.save(table);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteTable(Long id) {
        log.info("Deleting table ID: {}", id);
        if (!tableRepository.existsById(id)) {
            throw new ResourceNotFoundException("Table not found with ID: " + id);
        }
        tableRepository.deleteById(id);
    }

    private RestaurantTableDTO mapToDTO(RestaurantTable t) {
        return RestaurantTableDTO.builder()
                .id(t.getId())
                .restaurantId(t.getRestaurant().getId())
                .tableNumber(t.getTableNumber())
                .capacity(t.getCapacity())
                .status(t.getStatus())
                .build();
    }
}
