/**
 * ReserveIQ - Protected Route Component
 * ---------------------------------------
 * Acts as a route guard.
 * - Redirects to /login if user is not authenticated.
 * - Checks user role if a 'requiredRole' prop is provided.
 * - Shows "Not Authorized" message if role doesn't match.
 *
 * Usage:
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<CustomerDashboard />} />
 * </Route>
 *
 * Or for role-specific routes:
 * <Route element={<ProtectedRoute requiredRole="MANAGER" />}>
 *   <Route path="/manager/restaurants" element={<RestaurantManagement />} />
 * </Route>
 */

import { Navigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, currentUser, hasRole } = useAuth();

  // If not logged in at all, send to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}
      >
        <Paper elevation={3} sx={{ p: 5, textAlign: 'center', maxWidth: 500 }}>
          <LockIcon sx={{ fontSize: 64, color: '#dc2626', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You don't have permission to access this page.
            This section requires the <strong>{requiredRole}</strong> role,
            but you are logged in as <strong>{currentUser?.role}</strong>.
          </Typography>
          <Button
            variant="contained"
            href="/"
            sx={{ backgroundColor: '#d97706', '&:hover': { backgroundColor: '#b45309' } }}
          >
            Go to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  // If all checks pass, render the children (the protected page)
  return children;
};

export default ProtectedRoute;
