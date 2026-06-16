/**
 * ReserveIQ - Mock Data (Simulates MySQL Database)
 * -------------------------------------------------
 * This file contains sample data that mimics what would come from our
 * Spring Boot backend connected to MySQL. In production, Axios will
 * make HTTP calls to the real API instead of using this data directly.
 */

// ==================== USERS TABLE ====================
// Roles: CUSTOMER, MANAGER, ADMIN
export const mockUsers = [
  {
    id: 1,
    fullName: 'John Customer',
    email: 'john@example.com',
    password: 'password123', // In real app this is BCrypt hashed
    role: 'CUSTOMER',
    createdAt: '2024-01-15T10:30:00',
    phone: '+1-555-0101'
  },
  {
    id: 2,
    fullName: 'Maria Manager',
    email: 'maria@reserveiq.com',
    password: 'manager123',
    role: 'MANAGER',
    createdAt: '2024-01-10T09:00:00',
    phone: '+1-555-0102'
  },
  {
    id: 3,
    fullName: 'Admin User',
    email: 'admin@reserveiq.com',
    password: 'admin123',
    role: 'ADMIN',
    createdAt: '2024-01-01T08:00:00',
    phone: '+1-555-0100'
  },
  {
    id: 4,
    fullName: 'Sarah Smith',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'CUSTOMER',
    createdAt: '2024-02-01T14:20:00',
    phone: '+1-555-0103'
  }
];

// ==================== RESTAURANTS TABLE ====================
export const mockRestaurants = [
  {
    id: 1,
    name: 'The Golden Fork',
    description: 'A fine dining experience with modern European cuisine, featuring locally-sourced ingredients and an award-winning wine list.',
    cuisine: 'French',
    address: '123 Gourmet Street, Downtown',
    phoneNumber: '+1-555-1001',
    openingTime: '17:00',
    closingTime: '23:00',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    managerId: 2,
    averageRating: 4.7
  },
  {
    id: 2,
    name: 'Sakura Sushi House',
    description: 'Authentic Japanese sushi and sashimi prepared by master chefs with over 20 years of experience. Fresh fish flown daily from Tokyo.',
    cuisine: 'Japanese',
    address: '456 Cherry Blossom Ave, Midtown',
    phoneNumber: '+1-555-1002',
    openingTime: '12:00',
    closingTime: '22:00',
    imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800',
    managerId: 2,
    averageRating: 4.9
  },
  {
    id: 3,
    name: 'Pasta Paradise',
    description: 'Traditional Italian recipes passed down through generations. Wood-fired pizzas and homemade pasta in a cozy, rustic setting.',
    cuisine: 'Italian',
    address: '789 Tuscan Road, Little Italy',
    phoneNumber: '+1-555-1003',
    openingTime: '11:00',
    closingTime: '22:30',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    managerId: null,
    averageRating: 4.5
  },
  {
    id: 4,
    name: 'Spice Route Kitchen',
    description: 'Vibrant Indian flavors from every region. From butter chicken to dosas, experience the rich tapestry of Indian cuisine.',
    cuisine: 'Indian',
    address: '321 Masala Lane, Arts District',
    phoneNumber: '+1-555-1004',
    openingTime: '11:30',
    closingTime: '22:00',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    managerId: null,
    averageRating: 4.6
  },
  {
    id: 5,
    name: 'Ocean Breeze Seafood',
    description: 'Fresh coastal cuisine with stunning waterfront views. Oyster bar, lobster specials, and seasonal catch of the day.',
    cuisine: 'Seafood',
    address: '555 Harbor Drive, Waterfront',
    phoneNumber: '+1-555-1005',
    openingTime: '16:00',
    closingTime: '23:00',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    managerId: null,
    averageRating: 4.4
  },
  {
    id: 6,
    name: 'Burger Barn',
    description: 'Gourmet craft burgers, hand-cut fries, and milkshakes. The best casual dining spot for families and burger enthusiasts.',
    cuisine: 'American',
    address: '888 Main Street, Suburbia',
    phoneNumber: '+1-555-1006',
    openingTime: '11:00',
    closingTime: '21:00',
    imageUrl: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
    managerId: 2,
    averageRating: 4.3
  }
];

// ==================== RESTAURANT_TABLES TABLE ====================
// Table status: AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE
export const mockTables = [
  { id: 1, restaurantId: 1, tableNumber: 1, capacity: 2, status: 'AVAILABLE' },
  { id: 2, restaurantId: 1, tableNumber: 2, capacity: 2, status: 'AVAILABLE' },
  { id: 3, restaurantId: 1, tableNumber: 3, capacity: 4, status: 'RESERVED' },
  { id: 4, restaurantId: 1, tableNumber: 4, capacity: 4, status: 'AVAILABLE' },
  { id: 5, restaurantId: 1, tableNumber: 5, capacity: 6, status: 'AVAILABLE' },
  { id: 6, restaurantId: 1, tableNumber: 6, capacity: 8, status: 'AVAILABLE' },
  { id: 7, restaurantId: 2, tableNumber: 1, capacity: 2, status: 'AVAILABLE' },
  { id: 8, restaurantId: 2, tableNumber: 2, capacity: 4, status: 'OCCUPIED' },
  { id: 9, restaurantId: 2, tableNumber: 3, capacity: 4, status: 'AVAILABLE' },
  { id: 10, restaurantId: 2, tableNumber: 4, capacity: 6, status: 'AVAILABLE' },
  { id: 11, restaurantId: 3, tableNumber: 1, capacity: 2, status: 'AVAILABLE' },
  { id: 12, restaurantId: 3, tableNumber: 2, capacity: 2, status: 'AVAILABLE' },
  { id: 13, restaurantId: 3, tableNumber: 3, capacity: 4, status: 'AVAILABLE' },
  { id: 14, restaurantId: 3, tableNumber: 4, capacity: 4, status: 'MAINTENANCE' },
  { id: 15, restaurantId: 3, tableNumber: 5, capacity: 8, status: 'AVAILABLE' }
];

// ==================== RESERVATIONS TABLE ====================
// Status: PENDING, CONFIRMED, CANCELLED, COMPLETED, REJECTED
export const mockReservations = [
  {
    id: 1,
    userId: 1,
    tableId: 3,
    restaurantId: 1,
    reservationDate: '2025-02-15',
    reservationTime: '19:00',
    guestCount: 4,
    status: 'CONFIRMED',
    specialRequests: 'Window seat preferred, anniversary dinner',
    createdAt: '2025-02-01T10:00:00'
  },
  {
    id: 2,
    userId: 1,
    tableId: 9,
    restaurantId: 2,
    reservationDate: '2025-02-20',
    reservationTime: '18:30',
    guestCount: 3,
    status: 'PENDING',
    specialRequests: 'Allergy to shellfish',
    createdAt: '2025-02-05T14:30:00'
  },
  {
    id: 3,
    userId: 4,
    tableId: 1,
    restaurantId: 1,
    reservationDate: '2025-01-20',
    reservationTime: '20:00',
    guestCount: 2,
    status: 'COMPLETED',
    specialRequests: '',
    createdAt: '2025-01-10T09:00:00'
  },
  {
    id: 4,
    userId: 1,
    tableId: 13,
    restaurantId: 3,
    reservationDate: '2025-03-01',
    reservationTime: '19:30',
    guestCount: 4,
    status: 'PENDING',
    specialRequests: 'Birthday celebration - please bring cake',
    createdAt: '2025-02-08T16:45:00'
  }
];

// ==================== REVIEWS TABLE ====================
export const mockReviews = [
  {
    id: 1,
    userId: 4,
    restaurantId: 1,
    rating: 5,
    comment: 'Absolutely incredible dining experience! The filet mignon was cooked to perfection and the service was impeccable. Will definitely return for our anniversary next year.',
    createdAt: '2025-01-22T20:00:00'
  },
  {
    id: 2,
    userId: 1,
    restaurantId: 2,
    rating: 5,
    comment: 'Best sushi I have ever had outside of Japan. The omakase was worth every penny. Chef Takeshi is a true artist.',
    createdAt: '2025-01-15T19:30:00'
  },
  {
    id: 3,
    userId: 4,
    restaurantId: 3,
    rating: 4,
    comment: 'Great pasta and wonderful atmosphere. The tiramisu was a bit sweet for my taste but otherwise excellent.',
    createdAt: '2025-01-28T21:15:00'
  },
  {
    id: 4,
    userId: 1,
    restaurantId: 6,
    rating: 4,
    comment: 'Juicy burgers and crispy fries. Good value for money and family-friendly environment.',
    createdAt: '2025-02-02T18:00:00'
  }
];

// Cuisine types for filtering
export const cuisineTypes = [
  'All', 'French', 'Japanese', 'Italian', 'Indian', 'Seafood', 'American',
  'Chinese', 'Mexican', 'Thai', 'Mediterranean', 'Steakhouse'
];
