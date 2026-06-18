/**
 * ReserveIQ - Review Service
 * ----------------------------
 * Handles customer reviews for restaurants.
 *
 * Endpoints:
 * POST   /api/reviews                  → createReview()       [CUSTOMER]
 * GET    /api/reviews/restaurant/:id   → getReviewsByRestaurant()
 */

import { mockReviews, mockUsers } from '../data/mockData.js';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper: Attach user's name to a review
 */
const enrichReview = (review) => {
  const user = mockUsers.find(u => u.id === review.userId);
  return {
    ...review,
    userName: user?.fullName || 'Anonymous'
  };
};

/**
 * Create a new review
 */
export const createReview = async (reviewData) => {
  await delay(600);
  // Check if user already reviewed this restaurant
  const existing = mockReviews.find(
    r => r.userId === Number(reviewData.userId) &&
         r.restaurantId === Number(reviewData.restaurantId)
  );
  if (existing) {
    throw new Error('You have already reviewed this restaurant');
  }

  const newReview = {
    id: Math.max(...mockReviews.map(r => r.id), 0) + 1,
    userId: Number(reviewData.userId),
    restaurantId: Number(reviewData.restaurantId),
    rating: Number(reviewData.rating),
    comment: reviewData.comment,
    createdAt: new Date().toISOString()
  };
  mockReviews.push(newReview);
  return enrichReview(newReview);
};

/**
 * Get all reviews for a restaurant
 */
export const getReviewsByRestaurant = async (restaurantId) => {
  await delay();
  return mockReviews
    .filter(r => r.restaurantId === Number(restaurantId))
    .map(enrichReview)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};
