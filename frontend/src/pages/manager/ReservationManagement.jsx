/**
 * ReserveIQ - Reservation Management (Manager)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Tabs, Tab, CircularProgress, Paper
} from '@mui/material';
import { MenuBook } from '@mui/icons-material';
import {
  getAllReservations, approveReservation, rejectReservation
} from '../../services/reservationService.js';
import ReservationCard from '../../components/ReservationCard.jsx';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const loadData = () => {
    setLoading(true);
    getAllReservations()
      .then(setReservations)
      .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (id) => {
    try {
      await approveReservation(id);
      enqueueSnackbar('✅ Reservation approved', { variant: 'success' });
      loadData();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectReservation(id);
      enqueueSnackbar('Reservation rejected', { variant: 'warning' });
      loadData();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const pending = reservations.filter(r => r.status === 'PENDING');
  const confirmed = reservations.filter(r => r.status === 'CONFIRMED');
  const all = reservations;

  const getDisplayed = () => {
    if (tab === 0) return pending;
    if (tab === 1) return confirmed;
    return all;
  };

  const displayed = getDisplayed();

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
          <MenuBook sx={{ mr: 1, verticalAlign: 'middle', color: '#d97706' }} />
          Reservation Requests
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Approve or reject incoming booking requests
        </Typography>
      </motion.div>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label={`Pending (${pending.length})`} />
          <Tab label={`Confirmed (${confirmed.length})`} />
          <Tab label={`All (${all.length})`} />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: '#d97706' }} /></Box>
      ) : displayed.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed #e5e7eb' }}>
          <Typography variant="body1" color="text.secondary">
            No reservations in this category.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {displayed.map((res, idx) => (
            <ReservationCard
              key={res.id}
              reservation={res}
              viewMode="manager"
              onApprove={handleApprove}
              onReject={handleReject}
              index={idx}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ReservationManagement;
