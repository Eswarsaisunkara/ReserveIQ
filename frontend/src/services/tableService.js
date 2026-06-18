/**
 * ReserveIQ - Table Service
 * --------------------------
 * Handles restaurant table management API calls.
 *
 * Endpoints:
 * GET    /api/tables/restaurant/:restaurantId  → getTablesByRestaurant()
 * POST   /api/tables                           → createTable()    [MANAGER]
 * PUT    /api/tables/:id                       → updateTable()    [MANAGER]
 * DELETE /api/tables/:id                       → deleteTable()    [MANAGER]
 */

import { mockTables } from '../data/mockData.js';

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all tables for a specific restaurant
 */
export const getTablesByRestaurant = async (restaurantId) => {
  await delay();
  return mockTables.filter(t => t.restaurantId === Number(restaurantId));
};

/**
 * Create a new table for a restaurant
 */
export const createTable = async (tableData) => {
  await delay(500);
  const newTable = {
    id: Math.max(...mockTables.map(t => t.id), 0) + 1,
    restaurantId: Number(tableData.restaurantId),
    tableNumber: Number(tableData.tableNumber),
    capacity: Number(tableData.capacity),
    status: tableData.status || 'AVAILABLE'
  };
  mockTables.push(newTable);
  return newTable;
};

/**
 * Update a table (e.g., change status, capacity)
 */
export const updateTable = async (id, tableData) => {
  await delay(300);
  const index = mockTables.findIndex(t => t.id === Number(id));
  if (index === -1) throw new Error('Table not found');
  mockTables[index] = { ...mockTables[index], ...tableData };
  return mockTables[index];
};

/**
 * Delete a table
 */
export const deleteTable = async (id) => {
  await delay(300);
  const index = mockTables.findIndex(t => t.id === Number(id));
  if (index === -1) throw new Error('Table not found');
  mockTables.splice(index, 1);
  return { success: true };
};

/**
 * Get available tables for a restaurant on a specific date/time
 * (for customers making reservations)
 */
export const getAvailableTables = async (restaurantId, guestCount) => {
  await delay();
  return mockTables.filter(
    t => t.restaurantId === Number(restaurantId) &&
         t.capacity >= Number(guestCount) &&
         t.status === 'AVAILABLE'
  );
};
