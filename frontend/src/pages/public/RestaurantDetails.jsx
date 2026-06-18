/**
 * ReserveIQ - Premium Restaurant Details Page
 * Outstanding UI with photo hero grid, tabs (Overview, Menu, Virtual Queue & Tables, Reviews),
 * live virtual queue join simulation, beautiful reservation dialog, and review submission.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import {
  Container, Box, Typography, Grid, Paper, Button, Chip,
  Divider, Rating, TextField, MenuItem, CircularProgress,
  Card, CardContent, Dialog, DialogTitle, DialogContent,
  DialogActions, Tabs, Tab, Avatar, LinearProgress,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  LocationOn, Phone, AccessTime, People, TableBar,
  Star, ArrowBack, Add as AddIcon, EmojiEvents, CheckCircle,
  MenuBook, PhotoLibrary, RateReview, LocalDining, DirectionsWalk,
  WatchLater, Speed, AutoAwesome
} from '@mui/icons-material';
import { getRestaurantById } from '../../services/restaurantService.js';
import { createReservation } from '../../services/reservationService.js';
import { createReview } from '../../services/reviewService.js';
import { getAvailableTables } from '../../services/tableService.js';
import ReviewCard from '../../components/ReviewCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

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

const mockMenu = [
  { category: 'Starters', name: 'Truffle Burrata Crostini', desc: 'Fresh local burrata, black winter truffle honey, grilled sourdough', price: '$22' },
  { category: 'Starters', name: 'Charred Spanish Octopus', desc: 'Lemon herb emulsion, crispy capers, fingerling potato', price: '$26' },
  { category: 'Mains', name: 'Dry-Aged Wagyu Tomahawk', desc: '45-day dry aged ribeye, bone marrow butter, wild forest mushrooms', price: '$85' },
  { category: 'Mains', name: 'Pan-Seared Chilean Sea Bass', desc: 'Saffron cauliflower puree, charred baby leeks, caviar reduction', price: '$48' },
  { category: 'Desserts', name: 'Valrhona Chocolate Souffle', desc: 'Molten center, Madagascar vanilla bean gelato, gold leaf', price: '$18' }
];

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  // Reservation form state
  const [resDialogOpen, setResDialogOpen] = useState(false);
  const [reservationData, setReservationData] = useState({
    date: '', time: '', guestCount: 2, specialRequests: '', tableId: ''
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [submittingRes, setSubmittingRes] = useState(false);

  // Virtual Queue State
  const [inQueue, setInQueue] = useState(false);
  const [queuePos, setQueuePos] = useState(4); // Simulated 4th in line
  const [estWait, setEstWait] = useState(25); // wait in mins

  // Review form state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

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
      enqueueSnackbar('Please sign in to confirm your booking', { variant: 'info' });
      navigate('/login', { state: { from: { pathname: `/restaurants/${id}` } } });
      return;
    }
    setResDialogOpen(true);
  };

  const handleJoinQueue = () => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please sign in to join the live virtual queue', { variant: 'info' });
      navigate('/login', { state: { from: { pathname: `/restaurants/${id}` } } });
      return;
    }
    setInQueue(true);
    enqueueSnackbar('You have successfully joined the virtual queue! 🎉', { variant: 'success' });
    // Simulate queue moving
    setTimeout(() => {
      setQueuePos(3);
      setEstWait(18);
      enqueueSnackbar('⚡ Quick update: You are now 3rd in line!', { variant: 'info' });
    }, 6000);
  };

  const handleLeaveQueue = () => {
    setInQueue(false);
    enqueueSnackbar('You have stepped out of the queue', { variant: 'warning' });
  };

  const submitReservation = async (e) => {
    e.preventDefault();
    if (!reservationData.date || !reservationData.time || !reservationData.tableId) {
      enqueueSnackbar('Please select date, time, and table', { variant: 'warning' });
      return;
    }
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
      enqueueSnackbar('🎉 Reservation submitted successfully! Status: PENDING (awaiting manager approval).', { variant: 'success' });
      setResDialogOpen(false);
      setReservationData({ date: '', time: '', guestCount: 2, specialRequests: '', tableId: '' });
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
    if (!reviewData.comment.trim()) {
      enqueueSnackbar('Please write a comment', { variant: 'warning' });
      return;
    }
    setSubmittingReview(true);
    try {
      await createReview({
        userId: currentUser.id,
        restaurantId: restaurant.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      enqueueSnackbar('✨ Thank you for your feedback! Review posted successfully.', { variant: 'success' });
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#d97706' }} size={60} />
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Restaurant Not Found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/restaurants')} variant="contained">
          Browse Restaurants
        </Button>
      </Container>
    );
  }

  const timeSlots = generateTimeSlots(restaurant.openingTime, restaurant.closingTime);
  const today = new Date().toISOString().split('T')[0];

  return (
    <Box sx={{ pb: 12 }}>
      {/* ===== PREMIUM PHOTO gallery HERO ===== */}
      <Box sx={{ bgcolor: '#0f172a', position: 'relative', height: { xs: 320, md: 460 }, overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid item xs={12} md={8} sx={{ height: '100%', position: 'relative' }}>
            <Box
              component="img"
              src={restaurant.imageUrl}
              alt={restaurant.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.85) 0%, transparent 60%)' }} />
          </Grid>
          <Grid item xs={12} md={4} sx={{ height: '100%', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 1, p: 1, bgcolor: '#0f172a' }}>
            <Box component="img" src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600" sx={{ flexGrow: 1, height: '48%', objectFit: 'cover', borderRadius: 2 }} />
            <Box component="img" src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600" sx={{ flexGrow: 1, height: '48%', objectFit: 'cover', borderRadius: 2 }} />
          </Grid>
        </Grid>

        {/* Back button & floating tags top */}
        <Box sx={{ position: 'absolute', top: 20, left: { xs: 16, md: 36 }, zIndex: 20, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/restaurants')}
            sx={{ bgcolor: 'rgba(0,0,0,0.65)', color: 'white', backdropFilter: 'blur(10px)', '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' } }}
          >
            All Restaurants
          </Button>
        </Box>
      </Box>

      {/* ===== FLOATING RESTAURANT DETAILS CARD ===== */}
      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -10 }, position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Paper elevation={8} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: '#ffffff', mb: 6, border: '1px solid #f1f5f9' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ maxWidth: { xs: '100%', md: '65%' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h1" fontWeight={800} sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em', color: '#0f172a' }}>
                    {restaurant.name}
                  </Typography>
                  <Chip
                    label={restaurant.cuisine}
                    sx={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#92400e', fontWeight: 700, fontSize: '0.9rem', py: 2 }}
                  />
                  <Chip
                    icon={<EmojiEvents sx={{ color: '#d97706' }} />}
                    label="Michelin Guide Recommended"
                    sx={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fcd34d', fontWeight: 700 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
                  <Rating value={restaurant.averageRating || 0} precision={0.5} readOnly size="large" />
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#1f2937' }}>
                    {restaurant.averageRating?.toFixed(1) || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    ({restaurant.reviews?.length || 0} authenticated reviews)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d97706', fontWeight: 700, ml: 1 }}>
                    $$$$ • Fine Dining Premium
                  </Typography>
                </Box>
              </Box>

              {/* Primary action CTA buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', md: 'auto' } }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<DirectionsWalk />}
                  onClick={() => setTabIndex(2)}
                  sx={{
                    borderColor: '#0891b2', color: '#0891b2', fontWeight: 700, py: 1.6, px: 3, borderRadius: 3,
                    '&:hover': { bgcolor: '#cffafe', borderColor: '#0891b2' }
                  }}
                >
                  Virtual Queue Status
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<TableBar />}
                  onClick={handleReserve}
                  sx={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    fontWeight: 700, py: 1.6, px: 4, borderRadius: 3,
                    fontSize: '1.05rem',
                    boxShadow: '0 12px 28px rgba(217,119,6,0.3)',
                    '&:hover': { background: 'linear-gradient(135deg, #d97706, #b45309)' }
                  }}
                >
                  Reserve a Table
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: '#f1f5f9' }} />

            {/* Quick Infobar icon pills */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LocationOn sx={{ color: '#d97706', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Location</Typography>
                    <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ lineHeight: 1.3 }}>{restaurant.address}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <WatchLater sx={{ color: '#d97706', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Opening Hours</Typography>
                    <Typography variant="body2" fontWeight={600} color="text.primary">{restaurant.openingTime} – {restaurant.closingTime} Daily</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone sx={{ color: '#d97706', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Contact Desk</Typography>
                    <Typography variant="body2" fontWeight={600} color="text.primary">{restaurant.phoneNumber || '+1 (555) 0199'}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* ===== TAB NAVIGATION ===== */}
          <Paper elevation={2} sx={{ borderRadius: 3, mb: 4, bgcolor: '#ffffff', overflow: 'hidden' }}>
            <Tabs
              value={tabIndex}
              onChange={(_, v) => setTabIndex(v)}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': { py: 2.5, fontWeight: 700, fontSize: '1rem', color: '#6b7280', textTransform: 'none' },
                '& .Mui-selected': { color: '#d97706 !important', background: '#fffbeb' },
                '& .MuiTabs-indicator': { bgcolor: '#d97706', height: 3 }
              }}
            >
              <Tab icon={<LocalDining sx={{ mb: 0.5 }} />} label="Overview & Story" />
              <Tab icon={<MenuBook sx={{ mb: 0.5 }} />} label="Culinary Menu" />
              <Tab icon={<Speed sx={{ mb: 0.5 }} />} label="Virtual Queue & Tables" />
              <Tab icon={<RateReview sx={{ mb: 0.5 }} />} label={`Guest Reviews (${restaurant.reviews?.length || 0})`} />
            </Tabs>
          </Paper>

          {/* ===== TAB CONTENT WINDOW ===== */}
          <AnimatePresence mode="wait">
            <motion.div key={tabIndex} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              
              {/* TAB 0: OVERVIEW */}
              {tabIndex === 0 && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'white', border: '1px solid #f1f5f9' }}>
                      <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Playfair Display", serif', color: '#0f172a' }}>
                        About {restaurant.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, fontSize: '1.1rem', mb: 4, whiteSpace: 'pre-line' }}>
                        {restaurant.description}
                      </Typography>
                      
                      <Box sx={{ p: 3, bgcolor: '#fffbeb', borderRadius: 3, border: '1px solid #fde68a' }}>
                        <Typography variant="h6" fontWeight={700} color="#92400e" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AutoAwesome /> Executive Chef Highlights & Policy
                        </Typography>
                        <Typography variant="body2" color="#78350f" sx={{ lineHeight: 1.6 }}>
                          Our culinary philosophy revolves around peak organic seasonality and micro-sourced biodynamic farms.
                          Please inform your server of any acute allergies. Smart elegant attire requested.
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#0f172a', color: 'white', textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontFamily: '"Playfair Display", serif', color: '#fbbf24' }}>
                        ReserveIQ Guarantee
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 3, lineHeight: 1.6 }}>
                        Book directly on our platform for absolute priority table assignment and zero cancellation surcharges up to 2 hours prior.
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleReserve}
                        sx={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#78350f', fontWeight: 700 }}
                      >
                        Secure Priority Table
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {/* TAB 1: MENU */}
              {tabIndex === 1 && (
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: 'white', border: '1px solid #f1f5f9' }}>
                  <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 700, letterSpacing: 2 }}>TASTING & A LA CARTE</Typography>
                    <Typography variant="h2" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif', mt: 1 }}>
                      Seasonal Masterpiece Menu
                    </Typography>
                  </Box>

                  <Grid container spacing={4}>
                    {mockMenu.map((item, i) => (
                      <Grid item xs={12} md={6} key={i}>
                        <Box sx={{ p: 3, borderRadius: 3, border: '1px solid #f1f5f9', bgcolor: '#fafaf9', '&:hover': { borderColor: '#fde68a', bgcolor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'all 0.2s' } }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif', color: '#1f2937' }}>
                              {item.name}
                            </Typography>
                            <Typography variant="h6" fontWeight={800} sx={{ color: '#d97706' }}>
                              {item.price}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ display: 'inline-block', mb: 1, px: 1, py: 0.2, bgcolor: '#e0e7ff', color: '#3730a3', borderRadius: 1, fontWeight: 700 }}>
                            {item.category}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {item.desc}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}

              {/* TAB 2: VIRTUAL QUEUE & TABLES */}
              {tabIndex === 2 && (
                <Grid container spacing={4}>
                  {/* Virtual Queue Interactive Pod */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 4, borderRadius: 4, bgcolor: '#ffffff', border: '2px solid #0891b2', boxShadow: '0 10px 30px rgba(8,145,178,0.15)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #0891b2, #0e7490)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <Speed sx={{ fontSize: 32 }} />
                        </Box>
                        <Box>
                          <Typography variant="h5" fontWeight={800} sx={{ color: '#0f172a', fontFamily: '"Playfair Display", serif' }}>
                            Smart Virtual Queue
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Join before you arrive. Step right up when notified.
                          </Typography>
                        </Box>
                      </Box>

                      {inQueue ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-around', bgcolor: '#f8fafc', p: 3, borderRadius: 3, mb: 4 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>YOUR POSITION</Typography>
                              <Typography variant="h2" fontWeight={800} color="#0891b2" sx={{ fontFamily: '"Playfair Display", serif' }}>#{queuePos}</Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem />
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>ESTIMATED WAIT</Typography>
                              <Typography variant="h2" fontWeight={800} color="#d97706" sx={{ fontFamily: '"Playfair Display", serif' }}>{estWait}<span style={{ fontSize: '1.2rem' }}>m</span></Typography>
                            </Box>
                          </Box>

                          <LinearProgress variant="indeterminate" sx={{ height: 10, borderRadius: 5, mb: 4, bgcolor: '#cffafe', '& .MuiLinearProgress-bar': { bgcolor: '#0891b2' } }} />
                          
                          <Button variant="outlined" color="error" size="large" onClick={handleLeaveQueue} sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}>
                            Step Out of Queue
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <Box sx={{ mb: 4, textAlign: 'left', p: 3, bgcolor: '#f8fafc', borderRadius: 3 }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom>⚡ Why use Virtual Queue?</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>• Join instantly while traveling or sipping coffee nearby</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>• Live wait updates right on your smartphone</Typography>
                            <Typography variant="body2" color="text.secondary">• SMS / push notification the second your table is cleared</Typography>
                          </Box>
                          <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleJoinQueue}
                            sx={{ background: 'linear-gradient(135deg, #0891b2, #0e7490)', py: 2, fontSize: '1.1rem', fontWeight: 800, borderRadius: 3, '&:hover': { background: 'linear-gradient(135deg, #0e7490, #155e75)' } }}
                          >
                            Join Live Virtual Queue
                          </Button>
                        </Box>
                      )}
                    </Card>
                  </Grid>

                  {/* Table Inventory status list */}
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'white', border: '1px solid #f1f5f9', height: '100%' }}>
                      <Typography variant="h5" fontWeight={800} gutterBottom sx={{ fontFamily: '"Playfair Display", serif', color: '#0f172a', mb: 3 }}>
                        Interactive Table Seating Status
                      </Typography>

                      <Grid container spacing={2}>
                        {restaurant.tables?.map(t => {
                          const isAvail = t.status === 'AVAILABLE';
                          return (
                            <Grid item xs={6} key={t.id}>
                              <Box sx={{
                                p: 2.5, borderRadius: 3, textAlign: 'center',
                                border: '1px solid',
                                borderColor: isAvail ? '#10b981' : '#e5e7eb',
                                bgcolor: isAvail ? '#ecfdf5' : '#f9fafb'
                              }}>
                                <TableBar sx={{ fontSize: 36, color: isAvail ? '#10b981' : '#9ca3af', mb: 1 }} />
                                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#1f2937' }}>Table #{t.tableNumber}</Typography>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>Seats {t.capacity} Guests</Typography>
                                <Chip
                                  label={t.status}
                                  size="small"
                                  color={isAvail ? 'success' : 'default'}
                                  sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                />
                              </Box>
                            </Grid>
                          );
                        })}
                        {restaurant.tables?.length === 0 && (
                          <Typography variant="body1" color="text.secondary" sx={{ py: 6, textAlign: 'center', width: '100%' }}>
                            No table layouts configured.
                          </Typography>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {/* TAB 3: REVIEWS */}
              {tabIndex === 3 && (
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: 'white', border: '1px solid #f1f5f9' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="h3" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif', color: '#0f172a' }}>
                        Authenticated Reviews
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Read unedited feedback from diners who secured tables through ReserveIQ
                      </Typography>
                    </Box>
                    {isAuthenticated && currentUser.role === 'CUSTOMER' && (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => setReviewDialogOpen(true)}
                        sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontWeight: 700, px: 3, borderRadius: 3 }}
                      >
                        Write a Review
                      </Button>
                    )}
                  </Box>

                  {restaurant.reviews?.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center', bgcolor: '#fafaf9', borderRadius: 3 }}>
                      <RateReview sx={{ fontSize: 64, color: '#fcd34d', mb: 1 }} />
                      <Typography variant="h6" color="text.secondary">No reviews posted yet</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Be the first guest to share your dining experience!</Typography>
                      {isAuthenticated && currentUser.role === 'CUSTOMER' && (
                        <Button variant="outlined" onClick={() => setReviewDialogOpen(true)} sx={{ borderColor: '#d97706', color: '#d97706', fontWeight: 700 }}>
                          Write First Review
                        </Button>
                      )}
                    </Box>
                  ) : (
                    restaurant.reviews?.map((review, idx) => (
                      <ReviewCard key={review.id} review={review} index={idx} />
                    ))
                  )}
                </Paper>
              )}

            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Container>

      {/* ===== PREMIER RESERVATION MODAL DIALOG ===== */}
      <Dialog open={resDialogOpen} onClose={() => setResDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
        <Box sx={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', p: 3, color: 'white' }}>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif' }}>
            Book Table at {restaurant.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700 }}>INSTANT SECURE CONFIRMATION</Typography>
        </Box>

        <DialogContent sx={{ p: 4 }}>
          {!isAuthenticated ? (
            <Alert severity="info">Please log in to secure your reservation.</Alert>
          ) : (
            <Box component="form" onSubmit={submitReservation}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Reservation Date" name="date" type="date" required
                    value={reservationData.date} onChange={handleResChange}
                    InputLabelProps={{ shrink: true }} inputProps={{ min: today }}
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Reservation Time" name="time" select required
                    value={reservationData.time} onChange={handleResChange} size="medium"
                  >
                    {timeSlots.map(slot => (<MenuItem key={slot} value={slot}>{slot} Prime Sitting</MenuItem>))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Party Party Size" name="guestCount" select required
                    value={reservationData.guestCount} onChange={handleResChange} size="medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (<MenuItem key={n} value={n}>{n} {n === 1 ? 'Guest VIP' : 'Guests'}</MenuItem>))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Choose Preferred Table" name="tableId" select required
                    value={reservationData.tableId} onChange={handleResChange} size="medium"
                  >
                    {availableTables.length === 0 ? (
                      <MenuItem disabled value="">No matching table layouts</MenuItem>
                    ) : (
                      availableTables.map(t => (<MenuItem key={t.id} value={t.id}>Table #{t.tableNumber} (Capacity {t.capacity})</MenuItem>))
                    )}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Special Occasion Requests (optional)" name="specialRequests" multiline rows={3}
                    value={reservationData.specialRequests} onChange={handleResChange} size="medium"
                    placeholder="Anniversary, champagne request, outdoor window view preference..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        {isAuthenticated && (
          <DialogActions sx={{ px: 4, pb: 4, gap: 1 }}>
            <Button onClick={() => setResDialogOpen(false)} size="large" sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button
              onClick={submitReservation}
              variant="contained"
              disabled={submittingRes || !reservationData.tableId}
              size="large"
              sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontWeight: 800, px: 4, borderRadius: 3 }}
            >
              {submittingRes ? 'Confirming System...' : 'Confirm Premium Reservation'}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      {/* ===== REVIEW MODAL DIALOG ===== */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <Box sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', p: 3, color: 'white' }}>
          <Typography variant="h5" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif' }}>Write Exquisite Review</Typography>
        </Box>
        <DialogContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={submitReview}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={700}>Select Dining Rating</Typography>
              <Rating
                name="rating" value={reviewData.rating}
                onChange={(_, val) => setReviewData(prev => ({ ...prev, rating: val }))}
                size="large" sx={{ color: '#d97706' }}
              />
            </Box>
            <TextField
              fullWidth label="Your Detailed Culinary Experience" multiline rows={4} required
              value={reviewData.comment} onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="How was the Wagyu? Did the sommelier make excellent wine suggestions?..."
              size="medium"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button onClick={() => setReviewDialogOpen(false)} size="large">Cancel</Button>
          <Button onClick={submitReview} variant="contained" disabled={submittingReview} size="large" sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontWeight: 700, px: 4, borderRadius: 3 }}>
            {submittingReview ? 'Posting...' : 'Publish Feedback'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantDetails;
