/**
 * ReserveIQ - Reservation Service
 * ---------------------------------
 * Handles reservation/booking API calls.
 *
 * Endpoints:
 * POST   /api/reservations              → createReservation()   [CUSTOMER]
 * GET    /api/reservations              → getAllReservations()  [MANAGER/ADMIN]
 * GET    /api/reservations/my           → getMyReservations()   [CUSTOMER]
 * DELETE /api/reservations/:id          → cancelReservation()   [CUSTOMER/MANAGER]
 * PUT    /api/reservations/:id/approve  → approveReservation()  [MANAGER]
 * PUT    /api/reservations/:id/reject   → rejectReservation()   [MANAGER]
 */

import { mockReservations, mockRestaurants, mockTables, mockUsers } from '../data/mockData.js';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper: Attach restaurant and table info to a reservation
 */
const enrichReservation = (res) => {
  const restaurant = mockRestaurants.find(r => r.id === res.restaurantId);
  const table = mockTables.find(t => t.id === res.tableId);
  const user = mockUsers.find(u => u.id === res.userId);
  return {
    ...res,
    restaurantName: restaurant?.name || 'Unknown',
    restaurantImage: restaurant?.imageUrl,
    tableNumber: table?.tableNumber,
    customerName: user?.fullName || 'Unknown',
    customerEmail: user?.email
  };
};

/**
 * Create a new reservation (customer booking a table)
 */
export const createReservation = async (reservationData) => {
  await delay(700);
  const newReservation = {
    id: Math.max(...mockReservations.map(r => r.id), 0) + 1,
    userId: Number(reservationData.userId),
    tableId: Number(reservationData.tableId),
    restaurantId: Number(reservationData.restaurantId),
    reservationDate: reservationData.reservationDate,
    reservationTime: reservationData.reservationTime,
    guestCount: Number(reservationData.guestCount),
    status: 'PENDING',
    specialRequests: reservationData.specialRequests || '',
    createdAt: new Date().toISOString()
  };
  mockReservations.push(newReservation);
  return enrichReservation(newReservation);
};

/**
 * Get all reservations (for managers/admins - sees all)
 */
export const getAllReservations = async (statusFilter = null) => {
  await delay();
  let results = [...mockReservations];
  if (statusFilter) {
    results = results.filter(r => r.status === statusFilter);
  }
  return results.map(enrichReservation).sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
};

/**
 * Get reservations for a specific user (customer's own reservations)
 */
export const getMyReservations = async (userId) => {
  await delay();
  return mockReservations
    .filter(r => r.userId === Number(userId))
    .map(enrichReservation)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Get reservations for a specific restaurant (manager view)
 */
export const getReservationsByRestaurant = async (restaurantId) => {
  await delay();
  return mockReservations
    .filter(r => r.restaurantId === Number(restaurantId))
    .map(enrichReservation);
};

/**
 * Cancel a reservation
 */
export const cancelReservation = async (id) => {
  await delay(400);
  const index = mockReservations.findIndex(r => r.id === Number(id));
  if (index === -1) throw new Error('Reservation not found');
  mockReservations[index].status = 'CANCELLED';
  return enrichReservation(mockReservations[index]);
};

/**
 * Manager approves a reservation
 */
export const approveReservation = async (id) => {
  await delay(400);
  const index = mockReservations.findIndex(r => r.id === Number(id));
  if (index === -1) throw new Error('Reservation not found');
  mockReservations[index].status = 'CONFIRMED';
  return enrichReservation(mockReservations[index]);
};

/**
 * Manager rejects a reservation
 */
export const rejectReservation = async (id) => {
  await delay(400);
  const index = mockReservations.findIndex(r => r.id === Number(id));
  if (index === -1) throw new Error('Reservation not found');
  mockReservations[index].status = 'REJECTED';
  return enrichReservation(mockReservations[index]);
};
