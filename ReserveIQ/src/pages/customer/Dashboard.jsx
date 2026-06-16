/**
 * ReserveIQ - Customer Dashboard
 * ---------------------------------
 * Landing page after customer login. Shows welcome message,
 * upcoming reservations, quick actions.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Paper, Button, Chip, Avatar, CircularProgress
} from '@mui/material';
import {
  Restaurant, BookOnline, History, Star,
  TrendingUp, CalendarToday
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';
import { getMyReservations } from '../../services/reservationService.js';
import { mockRestaurants } from '../../data/mockData.js';

const CustomerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReservations(currentUser.id)
      .then(setReservations)
      .finally(() => setLoading(false));
  }, [currentUser.id]);

  const upcoming = reservations.filter(r =>
    r.status === 'CONFIRMED' || r.status === 'PENDING'
  );
  const past = reservations.filter(r =>
    r.status === 'COMPLETED' || r.status === 'CANCELLED'
  );

  const quickActions = [
    { label: 'Browse Restaurants', icon: <Restaurant />, path: '/restaurants', color: '#d97706' },
    { label: 'My Reservations', icon: <BookOnline />, path: '/my-reservations', color: '#0891b2' },
    { label: 'My Profile', icon: <Avatar sx={{ width: 24, height: 24 }} />, path: '/profile', color: '#059669' }
  ];

  return (
    <Box>
      {/* Welcome header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {currentUser.fullName.split(' ')[0]}! 👋
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
          Hungry? Book a table at your favorite restaurant or manage your existing reservations.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/restaurants')}
          sx={{
            backgroundColor: 'white',
            color: '#92400e',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#fef3c7' }
          }}
        >
          <Restaurant sx={{ mr: 1 }} /> Find a Restaurant
        </Button>
      </Paper>

      {/* Stats row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <CalendarToday sx={{ fontSize: 40, color: '#d97706', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">{upcoming.length}</Typography>
            <Typography variant="body2" color="text.secondary">Upcoming Bookings</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <History sx={{ fontSize: 40, color: '#0891b2', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">{past.length}</Typography>
            <Typography variant="body2" color="text.secondary">Past Visits</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <Star sx={{ fontSize: 40, color: '#059669', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">0</Typography>
            <Typography variant="body2" color="text.secondary">Reviews Written</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
            <TrendingUp sx={{ fontSize: 40, color: '#7c3aed', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">{mockRestaurants.length}</Typography>
            <Typography variant="body2" color="text.secondary">Restaurants Available</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick actions */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {quickActions.map((action, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(action.path)}
              sx={{
                py: 2,
                justifyContent: 'flex-start',
                borderColor: '#e5e7eb',
                color: action.color,
                '&:hover': {
                  borderColor: action.color,
                  backgroundColor: `${action.color}10`
                }
              }}
            >
              <Box sx={{ mr: 2 }}>{action.icon}</Box>
              <Typography fontWeight="600">{action.label}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming reservations */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Upcoming Reservations
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress sx={{ color: '#d97706' }} /></Box>
      ) : upcoming.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You don't have any upcoming reservations.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/restaurants')}
            sx={{ mt: 1, backgroundColor: '#d97706', '&:hover': { backgroundColor: '#b45309' } }}
          >
            Book a Table
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {upcoming.slice(0, 3).map(res => (
            <Grid item xs={12} md={4} key={res.id}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {res.restaurantName}
                  </Typography>
                  <Chip
                    label={res.status}
                    size="small"
                    color={res.status === 'CONFIRMED' ? 'success' : 'warning'}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  📅 {new Date(res.reservationDate).toLocaleDateString()} at {res.reservationTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  👥 {res.guestCount} guests • Table #{res.tableNumber}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CustomerDashboard;
