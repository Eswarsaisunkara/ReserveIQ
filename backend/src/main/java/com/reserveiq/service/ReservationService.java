package com.reserveiq.service;

import com.reserveiq.dto.ReservationDTO;

import java.util.List;

public interface ReservationService {

    ReservationDTO createReservation(ReservationDTO dto);

    List<ReservationDTO> getAllReservations();

    List<ReservationDTO> getMyReservations(Long userId);

    void cancelReservation(Long id);

    ReservationDTO approveReservation(Long id);

    ReservationDTO rejectReservation(Long id);
}
