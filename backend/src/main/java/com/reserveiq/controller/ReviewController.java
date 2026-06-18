package com.reserveiq.controller;

import com.reserveiq.dto.ReviewDTO;
import com.reserveiq.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Reviews", description = "Endpoints for posting and reading dining reviews")
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(summary = "Post review", description = "Leave a 1-5 rating and comment for a restaurant")
    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody ReviewDTO dto) {
        return new ResponseEntity<>(reviewService.createReview(dto), HttpStatus.CREATED);
    }

    @Operation(summary = "Get reviews by restaurant", description = "Public endpoint to read reviews for a restaurant")
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<ReviewDTO>> getReviewsByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(reviewService.getReviewsByRestaurant(restaurantId));
    }
}
