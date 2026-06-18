/**
 * ReserveIQ - Main App Component with Routing
 * ----------------------------------------------
 * This is the root component that sets up all React Router routes.
 *
 * Layouts:
 * - MainLayout: for public pages (Home, Login, Register, Restaurant list/details)
 * - DashboardLayout: for authenticated pages (dashboards, profile, management)
 *
 * ProtectedRoute wraps routes requiring authentication or specific roles.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Public pages
import Home from './pages/public/Home.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import RestaurantList from './pages/public/RestaurantList.jsx';
import RestaurantDetails from './pages/public/RestaurantDetails.jsx';

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard.jsx';
import MyReservations from './pages/customer/MyReservations.jsx';
import Profile from './pages/customer/Profile.jsx';

// Manager pages
import RestaurantManagement from './pages/manager/RestaurantManagement.jsx';
import TableManagement from './pages/manager/TableManagement.jsx';
import ReservationManagement from './pages/manager/ReservationManagement.jsx';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';

const App = () => {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />
      </Route>

      {/* ========== AUTHENTICATED ROUTES (All roles) ========== */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        {/* Profile is shared by all roles */}
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ========== CUSTOMER ROUTES ========== */}
      <Route element={
        <ProtectedRoute requiredRole="CUSTOMER">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/my-reservations" element={<MyReservations />} />
      </Route>

      {/* ========== MANAGER ROUTES ========== */}
      <Route element={
        <ProtectedRoute requiredRole="MANAGER">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/manager/restaurants" element={<RestaurantManagement />} />
        <Route path="/manager/tables/:restaurantId" element={<TableManagement />} />
        <Route path="/manager/reservations" element={<ReservationManagement />} />
      </Route>

      {/* ========== ADMIN ROUTES ========== */}
      <Route element={
        <ProtectedRoute requiredRole="ADMIN">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Route>

      {/* Fallback: redirect unknown URLs to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
