/**
 * ReserveIQ - Restaurant Details Page
 * -------------------------------------
 * Shows full info for one restaurant: photos, description, hours, tables,
 * reservation booking form, and reviews.
 *
 * GET /api/restaurants/:id
 * POST /api/reservations
 * POST /api/reviews
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import {
  Container, Box, Typography, Grid, Paper, Button, Chip,
  Divider, Rating, TextField, MenuItem, CircularProgress,
  Card, CardContent, Dialog, DialogTitle, DialogContent,
  DialogActions
} from '@mui/material';
import {
  LocationOn, Phone, AccessTime, People, TableBar,
  Star, ArrowBack, Add as AddIcon
} from '@mui/icons-material';
import { getRestaurantById } from '../../services/restaurantService.js';
import { createReservation } from '../../services/reservationService.js';
import { createReview } from '../../services/reviewService.js';
import { getAvailableTables } from '../../services/tableService.js';
import ReviewCard from '../../components/ReviewCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Generate time slots from opening to closing
const generateTimeSlots = (openTime, closeTime) => {
  const slots = [];
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);
  let h = openH;
  let m = openM;
  while (h < closeH || (h === closeH && m < closeM)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    m += 30;
    if (m >= 60) { h += 1; m = 0; }
  }
  return slots;
};

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reservation form state
  const [resDialogOpen, setResDialogOpen] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: '',
    time: '',
    guestCount: 2,
    specialRequests: '',
    tableId: ''
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [submittingRes, setSubmittingRes] = useState(false);

  // Review form state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch restaurant data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (err) {
        enqueueSnackbar(err.message || 'Failed to load restaurant', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // When guest count changes, fetch available tables
  useEffect(() => {
    if (restaurant && reservationData.guestCount) {
      getAvailableTables(restaurant.id, reservationData.guestCount)
        .then(setAvailableTables);
    }
  }, [restaurant, reservationData.guestCount]);

  const handleResChange = (e) => {
    setReservationData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/restaurants/${id}` } } });
      return;
    }
    setResDialogOpen(true);
  };

  const submitReservation = async (e) => {
    e.preventDefault();
    setSubmittingRes(true);
    try {
      await createReservation({
        userId: currentUser.id,
        tableId: reservationData.tableId,
        restaurantId: restaurant.id,
        reservationDate: reservationData.date,
        reservationTime: reservationData.time,
        guestCount: reservationData.guestCount,
        specialRequests: reservationData.specialRequests
      });
      enqueueSnackbar('🎉 Reservation submitted! Awaiting manager approval.', { variant: 'success' });
      setResDialogOpen(false);
      setReservationData({ date: '', time: '', guestCount: 2, specialRequests: '', tableId: '' });
      // Refresh tables
      const fresh = await getRestaurantById(id);
      setRestaurant(fresh);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setSubmittingRes(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await createReview({
        userId: currentUser.id,
        restaurantId: restaurant.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      enqueueSnackbar('✨ Thanks for your review! It has been posted.', { variant: 'success' });
      // Refresh restaurant to show new review
      const data = await getRestaurantById(id);
      setRestaurant(data);
      setReviewDialogOpen(false);
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#d97706' }} />
      </Box>
    );
  }

  if (!restaurant && !loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/restaurants')} sx={{ mt: 2 }}>
          Back to Restaurants
        </Button>
      </Container>
    );
  }

  const timeSlots = generateTimeSlots(restaurant.openingTime, restaurant.closingTime);
  const today = new Date().toISOString().split('T')[0]; // min date = today

  return (
    <Box sx={{ pb: 6 }}>
      {/* Hero Image */}
      <Box
        component="img"
        src={restaurant.imageUrl}
        alt={restaurant.name}
        sx={{
          width: '100%',
          height: { xs: 250, md: 400 },
          objectFit: 'cover'
        }}
      />

      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/restaurants')}
                sx={{ mb: 2, color: '#d97706' }}
              >
                Back to list
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="h3" fontWeight="bold">
                  {restaurant.name}
                </Typography>
                <Chip
                  label={restaurant.cuisine}
                  sx={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 600 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={restaurant.averageRating} precision={0.5} readOnly />
                <Typography variant="body1" fontWeight="600">
                  {restaurant.averageRating?.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({restaurant.reviews?.length || 0} reviews)
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<TableBar />}
              onClick={handleReserve}
              sx={{
                backgroundColor: '#d97706',
                fontWeight: 'bold',
                px: 4,
                '&:hover': { backgroundColor: '#b45309' }
              }}
            >
              Reserve a Table
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                About this restaurant
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                {restaurant.description}
              </Typography>

              <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mt: 3 }}>
                Available Tables
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {restaurant.tables?.filter(t => t.status === 'AVAILABLE').map(table => (
                  <Chip
                    key={table.id}
                    label={`Table #${table.tableNumber} (${table.capacity} seats)`}
                    variant="outlined"
                    size="small"
                  />
                ))}
                {restaurant.tables?.filter(t => t.status === 'AVAILABLE').length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No available tables at this time.
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Restaurant Info
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                    <LocationOn sx={{ color: '#d97706', mt: 0.5 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Address</Typography>
                      <Typography variant="body2">{restaurant.address}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                    <Phone sx={{ color: '#d97706', mt: 0.5 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Phone</Typography>
                      <Typography variant="body2">{restaurant.phoneNumber}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <AccessTime sx={{ color: '#d97706', mt: 0.5 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Hours</Typography>
                      <Typography variant="body2">
                        {restaurant.openingTime} - {restaurant.closingTime}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* REVIEWS SECTION */}
          <Divider sx={{ my: 4 }} />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h5" fontWeight="bold">
                Customer Reviews ({restaurant.reviews?.length || 0})
              </Typography>
              {isAuthenticated && currentUser.role === 'CUSTOMER' && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setReviewDialogOpen(true)}
                  sx={{ color: '#d97706', borderColor: '#d97706' }}
                >
                  Write a Review
                </Button>
              )}
            </Box>

            {restaurant.reviews?.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                No reviews yet. Be the first to review!
              </Typography>
            ) : (
              restaurant.reviews?.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </Box>
        </Paper>
        </motion.div>
      </Container>

      {/* RESERVATION DIALOG */}
      <Dialog open={resDialogOpen} onClose={() => setResDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">
          Reserve at {restaurant.name}
        </DialogTitle>
        <DialogContent>
          {!isAuthenticated ? (
            <Alert severity="info" sx={{ mt: 1 }}>
              Please <Button size="small" onClick={() => { setResDialogOpen(false); navigate('/login'); }}>log in</Button> to make a reservation.
            </Alert>
          ) : (
            <Box component="form" onSubmit={submitReservation} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    type="date"
                    required
                    value={reservationData.date}
                    onChange={handleResChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: today }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Time"
                    name="time"
                    select
                    required
                    value={reservationData.time}
                    onChange={handleResChange}
                  >
                    {timeSlots.map(slot => (
                      <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Guests"
                    name="guestCount"
                    select
                    required
                    value={reservationData.guestCount}
                    onChange={handleResChange}
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <MenuItem key={n} value={n}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Select Table"
                    name="tableId"
                    select
                    required
                    value={reservationData.tableId}
                    onChange={handleResChange}
                  >
                    {availableTables.length === 0 ? (
                      <MenuItem disabled value="">No tables available for this party size</MenuItem>
                    ) : (
                      availableTables.map(t => (
                        <MenuItem key={t.id} value={t.id}>
                          Table #{t.tableNumber} (seats {t.capacity})
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Special Requests (optional)"
                    name="specialRequests"
                    multiline
                    rows={3}
                    value={reservationData.specialRequests}
                    onChange={handleResChange}
                    placeholder="Allergies, seating preferences, celebrations..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        {isAuthenticated && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setResDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={submitReservation}
              variant="contained"
              disabled={submittingRes || !reservationData.tableId}
              sx={{ backgroundColor: '#d97706', '&:hover': { backgroundColor: '#b45309' } }}
            >
              {submittingRes ? 'Submitting...' : 'Confirm Reservation'}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* REVIEW DIALOG */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">Write a Review</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={submitReview} sx={{ mt: 1 }}>
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Typography component="legend" gutterBottom>Your Rating</Typography>
              <Rating
                name="rating"
                value={reviewData.rating}
                onChange={(_, val) => setReviewData(prev => ({ ...prev, rating: val }))}
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              label="Your Review"
              multiline
              rows={4}
              required
              value={reviewData.comment}
              onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Share your dining experience..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={submitReview}
            variant="contained"
            disabled={submittingReview}
            sx={{ backgroundColor: '#d97706', '&:hover': { backgroundColor: '#b45309' } }}
          >
            {submittingReview ? 'Posting...' : 'Post Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantDetails;
