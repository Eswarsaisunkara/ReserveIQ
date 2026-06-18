package com.reserveiq.service;

import com.reserveiq.dto.StatsDTO;
import com.reserveiq.dto.UserDTO;
import com.reserveiq.entity.ReservationStatus;
import com.reserveiq.entity.Role;
import com.reserveiq.entity.User;
import com.reserveiq.exception.ResourceNotFoundException;
import com.reserveiq.repository.ReservationRepository;
import com.reserveiq.repository.RestaurantRepository;
import com.reserveiq.repository.ReviewRepository;
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
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDTO updateUserRole(Long userId, Role newRole) {
        log.info("Updating User ID: {} to new Role: {}", userId, newRole);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setRole(newRole);
        User updated = userRepository.save(user);
        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        log.info("Deleting User ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public StatsDTO getPlatformStats() {
        log.info("Calculating comprehensive admin platform statistics");
        List<User> users = userRepository.findAll();

        long totalUsers = users.size();
        long customers = users.stream().filter(u -> u.getRole() == Role.CUSTOMER).count();
        long managers = users.stream().filter(u -> u.getRole() == Role.MANAGER).count();

        long totalRestaurants = restaurantRepository.count();
        long totalReservations = reservationRepository.count();
        
        long pendingRes = reservationRepository.findByStatusOrderByCreatedAtDesc(ReservationStatus.PENDING).size();
        long confirmedRes = reservationRepository.findByStatusOrderByCreatedAtDesc(ReservationStatus.CONFIRMED).size();
        
        long totalReviews = reviewRepository.count();

        return StatsDTO.builder()
                .totalUsers(totalUsers)
                .customers(customers)
                .managers(managers)
                .totalRestaurants(totalRestaurants)
                .totalReservations(totalReservations)
                .pendingReservations(pendingRes)
                .confirmedReservations(confirmedRes)
                .totalReviews(totalReviews)
                .build();
    }

    private UserDTO mapToDTO(User u) {
        return UserDTO.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .role(u.getRole())
                .phone(u.getPhone())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
