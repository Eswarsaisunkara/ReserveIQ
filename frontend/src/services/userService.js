/**
 * ReserveIQ - User Service (Admin)
 * ----------------------------------
 * Handles admin user management operations.
 *
 * Endpoints:
 * GET    /api/users      → getAllUsers()    [ADMIN]
 * PUT    /api/users/:id  → updateUserRole() [ADMIN]
 * DELETE /api/users/:id  → deleteUser()     [ADMIN]
 */

import { mockUsers } from '../data/mockData.js';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all users (admin only)
 */
export const getAllUsers = async () => {
  await delay();
  // Don't return passwords
  return mockUsers.map(({ password, ...user }) => user);
};

/**
 * Update a user's role (admin only)
 */
export const updateUserRole = async (userId, newRole) => {
  await delay(400);
  const user = mockUsers.find(u => u.id === Number(userId));
  if (!user) throw new Error('User not found');
  user.role = newRole;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Delete a user (admin only)
 */
export const deleteUser = async (userId) => {
  await delay(400);
  const index = mockUsers.findIndex(u => u.id === Number(userId));
  if (index === -1) throw new Error('User not found');
  mockUsers.splice(index, 1);
  return { success: true };
};

/**
 * Get platform statistics for admin dashboard
 */
export const getAdminStats = async () => {
  await delay();
  // We need to import these lazily to avoid circular issues
  const { mockRestaurants, mockReservations, mockReviews } = await import('../data/mockData.js');

  return {
    totalUsers: mockUsers.length,
    totalRestaurants: mockRestaurants.length,
    totalReservations: mockReservations.length,
    totalReviews: mockReviews.length,
    pendingReservations: mockReservations.filter(r => r.status === 'PENDING').length,
    confirmedReservations: mockReservations.filter(r => r.status === 'CONFIRMED').length,
    customers: mockUsers.filter(u => u.role === 'CUSTOMER').length,
    managers: mockUsers.filter(u => u.role === 'MANAGER').length
  };
};
