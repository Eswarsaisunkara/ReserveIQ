/**
 * ReserveIQ - Admin Dashboard
 * ------------------------------
 * Shows platform-wide statistics: total users, restaurants,
 * reservations, reviews, pending requests, etc.
 *
 * GET /api/admin/stats
 */

import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, CircularProgress, Chip, Link
} from '@mui/material';
import {
  People, Restaurant, BookOnline, Star, PendingActions,
  CheckCircle, AdminPanelSettings, Storefront
} from '@mui/icons-material';
import { getAdminStats } from '../../services/userService.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: <People sx={{ fontSize: 40, color: '#0891b2' }} />, bg: '#cffafe' },
    { label: 'Customers', value: stats?.customers, icon: <People sx={{ fontSize: 40, color: '#059669' }} />, bg: '#d1fae5' },
    { label: 'Managers', value: stats?.managers, icon: <Storefront sx={{ fontSize: 40, color: '#7c3aed' }} />, bg: '#ede9fe' },
    { label: 'Total Restaurants', value: stats?.totalRestaurants, icon: <Restaurant sx={{ fontSize: 40, color: '#d97706' }} />, bg: '#fef3c7' },
    { label: 'Total Reservations', value: stats?.totalReservations, icon: <BookOnline sx={{ fontSize: 40, color: '#2563eb' }} />, bg: '#dbeafe' },
    { label: 'Pending Approval', value: stats?.pendingReservations, icon: <PendingActions sx={{ fontSize: 40, color: '#d97706' }} />, bg: '#fef3c7' },
    { label: 'Confirmed', value: stats?.confirmedReservations, icon: <CheckCircle sx={{ fontSize: 40, color: '#059669' }} />, bg: '#d1fae5' },
    { label: 'Total Reviews', value: stats?.totalReviews, icon: <Star sx={{ fontSize: 40, color: '#dc2626' }} />, bg: '#fee2e2' }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#d97706' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          <AdminPanelSettings sx={{ mr: 1, verticalAlign: 'middle', color: '#d97706' }} />
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Platform overview and statistics
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={6} md={3} key={idx}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, backgroundColor: card.bg }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {card.label}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {card.value}
                  </Typography>
                </Box>
                {card.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Quick admin actions */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': { boxShadow: 4, transform: 'translateY(-2px)', transition: 'all 0.2s' }
            }}
            component={Link}
            href="/admin/users"
            underline="none"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <People sx={{ fontSize: 36, color: '#0891b2' }} />
              <Box>
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  Manage Users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View, promote, or remove users
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': { boxShadow: 4, transform: 'translateY(-2px)', transition: 'all 0.2s' }
            }}
            component={Link}
            href="/restaurants"
            underline="none"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Restaurant sx={{ fontSize: 36, color: '#d97706' }} />
              <Box>
                <Typography variant="h6" fontWeight="600" color="text.primary">
                  View All Restaurants
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse all restaurant listings
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
