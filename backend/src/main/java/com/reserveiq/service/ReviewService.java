package com.reserveiq.service;

import com.reserveiq.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {

    ReviewDTO createReview(ReviewDTO dto);

    List<ReviewDTO> getReviewsByRestaurant(Long restaurantId);
}
