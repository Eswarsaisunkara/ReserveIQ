package com.reserveiq.service;

import com.reserveiq.dto.ReservationDTO;
import com.reserveiq.entity.*;
import com.reserveiq.exception.BadRequestException;
import com.reserveiq.exception.ResourceNotFoundException;
import com.reserveiq.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RestaurantTableRepository tableRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    @Transactional
    public ReservationDTO createReservation(ReservationDTO dto) {
        log.info("Creating reservation for User ID: {} at Table ID: {}", dto.getUserId(), dto.getTableId());

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        RestaurantTable table = tableRepository.findById(dto.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Table not found with ID: " + dto.getTableId()));

        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + dto.getRestaurantId()));

        // Check if table capacity fits guests
        if (table.getCapacity() < dto.getGuestCount()) {
            throw new BadRequestException("Table capacity (" + table.getCapacity() + ") cannot accommodate " + dto.getGuestCount() + " guests");
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .table(table)
                .restaurant(restaurant)
                .reservationDate(dto.getReservationDate())
                .reservationTime(dto.getReservationTime())
                .guestCount(dto.getGuestCount())
                .status(ReservationStatus.PENDING)
                .specialRequests(dto.getSpecialRequests() != null ? dto.getSpecialRequests() : "")
                .build();

        Reservation saved = reservationRepository.save(reservation);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> getAllReservations() {
        return reservationRepository.findAll()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservationDTO> getMyReservations(Long userId) {
        return reservationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void cancelReservation(Long id) {
        log.info("Cancelling reservation ID: {}", id);
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    @Override
    @Transactional
    public ReservationDTO approveReservation(Long id) {
        log.info("Approving reservation ID: {}", id);
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));

        reservation.setStatus(ReservationStatus.CONFIRMED);
        Reservation updated = reservationRepository.save(reservation);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public ReservationDTO rejectReservation(Long id) {
        log.info("Rejecting reservation ID: {}", id);
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with ID: " + id));

        reservation.setStatus(ReservationStatus.REJECTED);
        Reservation updated = reservationRepository.save(reservation);
        return mapToDTO(updated);
    }

    private ReservationDTO mapToDTO(Reservation r) {
        return ReservationDTO.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .tableId(r.getTable().getId())
                .restaurantId(r.getRestaurant().getId())
                .restaurantName(r.getRestaurant().getName())
                .restaurantImage(r.getRestaurant().getImageUrl())
                .tableNumber(r.getTable().getTableNumber())
                .customerName(r.getUser().getFullName())
                .customerEmail(r.getUser().getEmail())
                .reservationDate(r.getReservationDate())
                .reservationTime(r.getReservationTime())
                .guestCount(r.getGuestCount())
                .status(r.getStatus())
                .specialRequests(r.getSpecialRequests())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
