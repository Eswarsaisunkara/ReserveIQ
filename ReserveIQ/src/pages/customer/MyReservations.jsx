/**
 * ReserveIQ - My Reservations Page (Customer)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Tabs, Tab, CircularProgress,
  Button, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Paper
} from '@mui/material';
import { Add as AddIcon, CalendarMonth } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getMyReservations, cancelReservation } from '../../services/reservationService.js';
import ReservationCard from '../../components/ReservationCard.jsx';

const MyReservations = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [cancelDialog, setCancelDialog] = useState(null);

  const loadReservations = () => {
    setLoading(true);
    getMyReservations(currentUser.id)
      .then(data => setReservations(data))
      .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadReservations(); }, [currentUser.id]);

  const handleCancel = async () => {
    try {
      await cancelReservation(cancelDialog);
      enqueueSnackbar('Reservation cancelled successfully', { variant: 'info' });
      setCancelDialog(null);
      loadReservations();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const upcoming = reservations.filter(r => r.status === 'PENDING' || r.status === 'CONFIRMED');
  const past = reservations.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED' || r.status === 'REJECTED');
  const displayed = tab === 0 ? upcoming : past;

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
              <CalendarMonth sx={{ mr: 1, verticalAlign: 'middle', color: '#d97706' }} />
              My Reservations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your upcoming and past bookings
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/restaurants')}
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Book New Table
          </Button>
        </Box>
      </motion.div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label={`Upcoming (${upcoming.length})`} />
          <Tab label={`History (${past.length})`} />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#d97706' }} />
        </Box>
      ) : displayed.length === 0 ? (
        <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 3, border: '1px dashed #e5e7eb' }}>
          <CalendarMonth sx={{ fontSize: 72, color: '#d1d5db', mb: 2 }} />
          <Typography variant="h6" gutterBottom color="text.secondary">
            {tab === 0 ? 'No upcoming reservations' : 'No past reservations yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {tab === 0 ? 'Why not book a table at one of our amazing restaurants?' : 'Your dining history will appear here.'}
          </Typography>
          {tab === 0 && (
            <Button
              variant="contained"
              onClick={() => navigate('/restaurants')}
              sx={{ borderRadius: 2 }}
            >
              Browse Restaurants
            </Button>
          )}
        </Paper>
      ) : (
        <Box>
          {displayed.map((res, idx) => (
            <ReservationCard
              key={res.id}
              reservation={res}
              viewMode="customer"
              onCancel={(id) => setCancelDialog(id)}
              index={idx}
            />
          ))}
        </Box>
      )}

      <Dialog open={!!cancelDialog} onClose={() => setCancelDialog(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Cancel this reservation?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure? The restaurant will be notified immediately.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCancelDialog(null)} variant="outlined">Keep it</Button>
          <Button onClick={handleCancel} color="error" variant="contained">
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyReservations;
