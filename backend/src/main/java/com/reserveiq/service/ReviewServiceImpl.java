package com.reserveiq.service;

import com.reserveiq.dto.ReviewDTO;
import com.reserveiq.entity.Restaurant;
import com.reserveiq.entity.Review;
import com.reserveiq.entity.User;
import com.reserveiq.exception.BadRequestException;
import com.reserveiq.exception.ResourceNotFoundException;
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
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    @Transactional
    public ReviewDTO createReview(ReviewDTO dto) {
        log.info("Creating review by User ID: {} for Restaurant ID: {}", dto.getUserId(), dto.getRestaurantId());

        if (reviewRepository.existsByUserIdAndRestaurantId(dto.getUserId(), dto.getRestaurantId())) {
            throw new BadRequestException("You have already submitted a review for this restaurant");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));

        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + dto.getRestaurantId()));

        Review review = Review.builder()
                .user(user)
                .restaurant(restaurant)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        Review saved = reviewRepository.save(review);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByRestaurant(Long restaurantId) {
        return reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private ReviewDTO mapToDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .restaurantId(r.getRestaurant().getId())
                .userName(r.getUser().getFullName())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
