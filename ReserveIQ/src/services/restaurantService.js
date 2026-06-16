/**
 * ReserveIQ - Restaurant Service
 * --------------------------------
 * Handles all restaurant-related API calls.
 * In production: uses Axios to call Spring Boot endpoints.
 * For this demo: simulates API calls with mock data + delay.
 *
 * Endpoints mapped:
 * GET    /api/restaurants         → getAllRestaurants()
 * GET    /api/restaurants/:id     → getRestaurantById()
 * POST   /api/restaurants         → createRestaurant()   [MANAGER/ADMIN]
 * PUT    /api/restaurants/:id     → updateRestaurant()   [MANAGER/ADMIN]
 * DELETE /api/restaurants/:id     → deleteRestaurant()   [MANAGER/ADMIN]
 * GET    /api/restaurants/search  → searchRestaurants()
 */

import { mockRestaurants, mockTables, mockReviews } from '../data/mockData.js';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all restaurants, optionally filtered by search/cuisine
 */
export const getAllRestaurants = async (searchTerm = '', cuisine = 'All') => {
  await delay();
  let results = [...mockRestaurants];

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    results = results.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.cuisine.toLowerCase().includes(term) ||
      r.address.toLowerCase().includes(term)
    );
  }

  if (cuisine && cuisine !== 'All') {
    results = results.filter(r => r.cuisine === cuisine);
  }

  return results;
};

/**
 * Get a single restaurant by ID with its tables and reviews
 */
export const getRestaurantById = async (id) => {
  await delay();
  const restaurant = mockRestaurants.find(r => r.id === Number(id));
  if (!restaurant) {
    throw new Error('Restaurant not found');
  }
  // Attach associated tables
  const tables = mockTables.filter(t => t.restaurantId === Number(id));
  // Attach reviews
  const reviews = mockReviews.filter(r => r.restaurantId === Number(id));
  return { ...restaurant, tables, reviews };
};

/**
 * Create a new restaurant (MANAGER or ADMIN only)
 */
export const createRestaurant = async (restaurantData) => {
  await delay(700);
  const newRestaurant = {
    id: Math.max(...mockRestaurants.map(r => r.id)) + 1,
    name: restaurantData.name,
    description: restaurantData.description,
    cuisine: restaurantData.cuisine,
    address: restaurantData.address,
    phoneNumber: restaurantData.phoneNumber,
    openingTime: restaurantData.openingTime,
    closingTime: restaurantData.closingTime,
    imageUrl: restaurantData.imageUrl || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
    managerId: restaurantData.managerId || null,
    averageRating: 0
  };
  mockRestaurants.push(newRestaurant);
  return newRestaurant;
};

/**
 * Update an existing restaurant
 */
export const updateRestaurant = async (id, restaurantData) => {
  await delay(500);
  const index = mockRestaurants.findIndex(r => r.id === Number(id));
  if (index === -1) throw new Error('Restaurant not found');

  mockRestaurants[index] = { ...mockRestaurants[index], ...restaurantData };
  return mockRestaurants[index];
};

/**
 * Delete a restaurant
 */
export const deleteRestaurant = async (id) => {
  await delay(400);
  const index = mockRestaurants.findIndex(r => r.id === Number(id));
  if (index === -1) throw new Error('Restaurant not found');
  mockRestaurants.splice(index, 1);
  return { success: true, message: 'Restaurant deleted successfully' };
};

/**
 * Get restaurants managed by a specific manager
 */
export const getRestaurantsByManager = async (managerId) => {
  await delay();
  return mockRestaurants.filter(r => r.managerId === Number(managerId));
};
