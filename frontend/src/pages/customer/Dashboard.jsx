/**
 * ReserveIQ - Premium Customer VIP Dashboard
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Typography, Grid, Paper, Button, Chip, Avatar, CircularProgress,
  Card, CardContent, Divider
} from '@mui/material';
import {
  Restaurant, BookOnline, History, Star,
  TrendingUp, CalendarToday, AutoAwesome, CardGiftcard, Explore, Person
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
    r.status === 'COMPLETED' || r.status === 'CANCELLED' || r.status === 'REJECTED'
  );

  const quickActions = [
    { label: 'Browse Top Restaurants', desc: 'Find your next culinary adventure', icon: <Explore sx={{ fontSize: 32 }} />, path: '/restaurants', color: '#d97706', bg: '#fef3c7' },
    { label: 'My Bookings Desk', desc: 'View or modify reservations', icon: <BookOnline sx={{ fontSize: 32 }} />, path: '/my-reservations', color: '#0891b2', bg: '#cffafe' },
    { label: 'VIP Profile Status', desc: 'Update details & preferences', icon: <Person sx={{ fontSize: 32 }} />, path: '/profile', color: '#059669', bg: '#d1fae5' }
  ];

  return (
    <Box sx={{ pb: 10 }}>
      {/* VIP Premium Welcome Header Card */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3.5, md: 6 },
            mb: 5,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #78350f 100%)',
            color: 'white',
            borderRadius: 5,
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.12)'
          }}
        >
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 280, height: 280, bgcolor: 'rgba(245,158,11,0.15)', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(30px)' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Chip
                icon={<AutoAwesome sx={{ color: '#fbbf24 !important' }} />}
                label="RESERVEIQ VIP CLUB MEMBER"
                sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)', color: '#fbbf24', fontWeight: 700, letterSpacing: 1 }}
              />
              <Typography variant="h2" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, fontFamily: '"Playfair Display", serif' }}>
                Welcome back, {currentUser.fullName.split(' ')[0]}! 👋
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, maxWidth: 600, mb: 4, lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.15rem' } }}>
                Ready for an unforgettable dining experience? Secure your priority tables or manage your existing itineraries below.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/restaurants')}
                startIcon={<Restaurant />}
                sx={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#78350f',
                  fontWeight: 800,
                  px: 4, py: 1.6,
                  borderRadius: 3,
                  boxShadow: '0 10px 25px rgba(245,158,11,0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #f59e0b, #d97706)' }
                }}
              >
                Discover Prime Venues
              </Button>
            </Box>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', minWidth: 200 }}>
              <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700, letterSpacing: 1 }}>PRIORITY POINTS</Typography>
              <Typography variant="h2" fontWeight={800} sx={{ color: 'white', fontFamily: '"Playfair Display", serif', my: 1 }}>1,450</Typography>
              <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Next Tier: Gold Sommelier</Typography>
            </Paper>
          </Box>
        </Paper>
      </motion.div>

      {/* Overview Analytics Row */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 4, border: '1px solid #f1f5f9', bgcolor: 'white', '&:hover': { translateY: '-4px', boxShadow: 3, transition: 'all 0.2s' } }}>
            <CalendarToday sx={{ fontSize: 42, color: '#d97706', mb: 1.5 }} />
            <Typography variant="h3" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif', color: '#0f172a' }}>{upcoming.length}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Active Bookings</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 4, border: '1px solid #f1f5f9', bgcolor: 'white', '&:hover': { translateY: '-4px', boxShadow: 3, transition: 'all 0.2s' } }}>
            <History sx={{ fontSize: 42, color: '#0891b2', mb: 1.5 }} />
            <Typography variant="h3" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif', color: '#0f172a' }}>{past.length}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Dining History</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 4, border: '1px solid #f1f5f9', bgcolor: 'white', '&:hover': { translateY: '-4px', boxShadow: 3, transition: 'all 0.2s' } }}>
            <CardGiftcard sx={{ fontSize: 42, color: '#059669', mb: 1.5 }} />
            <Typography variant="h3" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif', color: '#0f172a' }}>$150</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Reward Credit</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 4, border: '1px solid #f1f5f9', bgcolor: 'white', '&:hover': { translateY: '-4px', boxShadow: 3, transition: 'all 0.2s' } }}>
            <TrendingUp sx={{ fontSize: 42, color: '#7c3aed', mb: 1.5 }} />
            <Typography variant="h3" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif', color: '#0f172a' }}>{mockRestaurants.length}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>Prime Venues</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Launch Control Buttons */}
      <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Playfair Display", serif', color: '#0f172a', mb: 3 }}>
        Quick Operations Desk
      </Typography>
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {quickActions.map((action, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Paper
                elevation={1}
                onClick={() => navigate(action.path)}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  cursor: 'pointer',
                  border: '1px solid #f1f5f9',
                  bgcolor: 'white',
                  '&:hover': { borderColor: action.color }
                }}
              >
                <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: action.bg, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {action.icon}
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700} color="text.primary">
                    {action.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.desc}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Reservation Itinerary Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif', color: '#0f172a' }}>
          Confirmed & Pending Itineraries
        </Typography>
        {upcoming.length > 0 && (
          <Button variant="outlined" onClick={() => navigate('/my-reservations')} sx={{ borderColor: '#d97706', color: '#d97706', fontWeight: 700 }}>
            Full Bookings History →
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: '#d97706' }} /></Box>
      ) : upcoming.length === 0 ? (
        <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 5, border: '2px dashed #e5e7eb', bgcolor: 'white' }}>
          <Restaurant sx={{ fontSize: 72, color: '#fcd34d', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontFamily: '"Playfair Display", serif', color: '#1f2937' }}>
            No upcoming itineraries
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            Your social calendar is wide open. Discover one of our Michelin Guide recommended spots for dinner tonight.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/restaurants')}
            sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontWeight: 700, px: 4, py: 1.5, borderRadius: 3 }}
          >
            Explore Prime Restaurants
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {upcoming.map(res => (
            <Grid item xs={12} md={4} key={res.id}>
              <Paper elevation={2} sx={{ p: 3.5, borderRadius: 4, borderLeft: '6px solid #d97706', bgcolor: 'white', position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif', color: '#0f172a' }}>
                    {res.restaurantName}
                  </Typography>
                  <Chip
                    label={res.status}
                    size="small"
                    sx={{
                      fontWeight: 700, fontSize: '0.75rem',
                      bgcolor: res.status === 'CONFIRMED' ? '#d1fae5' : '#fef3c7',
                      color: res.status === 'CONFIRMED' ? '#065f46' : '#92400e'
                    }}
                  />
                </Box>

                <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    📅 {new Date(res.reservationDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {res.reservationTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    👥 {res.guestCount} Prime Guests • Table #{res.tableNumber}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(`/restaurants/${res.restaurantId}`)}
                  sx={{ mt: 1, borderColor: '#e5e7eb', color: '#374151', fontWeight: 700, '&:hover': { bgcolor: '#fef3c7', borderColor: '#d97706', color: '#92400e' } }}
                >
                  Inspect Venue Info
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CustomerDashboard;
