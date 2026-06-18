/**
 * ReserveIQ - Premium Restaurant List Page
 * Breathtaking UI with glassmorphic search banner, interactive cuisine & rating filters,
 * smooth animations, skeletal loaders, and empty state.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container, Typography, TextField, Grid, Box, Chip,
  InputAdornment, CircularProgress, Alert, Button, Paper,
  Slider, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  Search as SearchIcon, FilterAlt, Star, Sort, RestartAlt,
  TrendingUp, LocalOffer, AutoAwesome
} from '@mui/icons-material';
import { getAllRestaurants } from '../../services/restaurantService.js';
import { cuisineTypes } from '../../data/mockData.js';
import RestaurantCard from '../../components/RestaurantCard.jsx';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'name'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getAllRestaurants(searchTerm, selectedCuisine);
      // Filter by minRating
      let filtered = data.filter(r => (r.averageRating || 0) >= minRating);
      // Sort
      if (sortBy === 'rating') {
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      } else if (sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }
      setRestaurants(filtered);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchRestaurants, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCuisine, minRating, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCuisine('All');
    setMinRating(0);
    setSortBy('rating');
  };

  return (
    <Box sx={{ pb: 12 }}>
      {/* ===== HERO SEARCH BANNER ===== */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #78350f 50%, #451a03 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
        color: 'white'
      }}>
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.12, mixBlendMode: 'overlay'
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AutoAwesome sx={{ color: '#fbbf24', fontSize: 24 }} />
              <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700, letterSpacing: 1.5 }}>
                CURATED DINING EXPERIENCES
              </Typography>
            </Box>
            <Typography variant="h1" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.8rem' }, fontFamily: '"Playfair Display", serif' }}>
              Discover Top <span className="text-gradient-amber">Restaurants</span>
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300, maxWidth: 640, mb: 4, lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.2rem' } }}>
              Explore the culinary masterpieces in your city. From rustic authentic Italian to award-winning omakase sushi.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* ===== FILTER & SEARCH CONTROL BAR ===== */}
      <Container maxWidth="lg" sx={{ mt: -5, mb: 6, position: 'relative', zIndex: 10 }}>
        <Paper elevation={6} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid #f1f5f9' }}>
          <Grid container spacing={2.5} alignItems="center">
            {/* Main search term input */}
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search by restaurant name, cuisine, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="medium"
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: '#d97706' }} /></InputAdornment>),
                  sx: { borderRadius: 2.5, bgcolor: 'white', '& fieldset': { borderColor: '#e5e7eb' } }
                }}
              />
            </Grid>

            {/* Sort Dropdown */}
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="medium">
                <InputLabel sx={{ fontWeight: 600 }}>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: 2.5, bgcolor: 'white' }}
                >
                  <MenuItem value="rating"><Sort sx={{ mr: 1, fontSize: 18, color: '#f59e0b', verticalAlign: 'middle' }} /> Top Rated</MenuItem>
                  <MenuItem value="name"><Sort sx={{ mr: 1, fontSize: 18, color: '#0891b2', verticalAlign: 'middle' }} /> Alphabetical (A-Z)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Min Rating Slider */}
            <Grid item xs={6} md={3}>
              <Box sx={{ px: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Min Rating</span>
                  <span style={{ color: '#d97706', fontWeight: 700 }}>{minRating > 0 ? `${minRating}.0★+` : 'Any Rating'}</span>
                </Typography>
                <Slider
                  value={minRating}
                  onChange={(_, val) => setMinRating(val)}
                  step={1} min={0} max={4}
                  marks
                  sx={{
                    color: '#f59e0b',
                    '& .MuiSlider-thumb': { '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(245,158,11,0.16)' } }
                  }}
                />
              </Box>
            </Grid>

            {/* Reset Filter Button */}
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={resetFilters}
                size="large"
                sx={{
                  height: 52, borderRadius: 2.5,
                  borderColor: '#e5e7eb', color: '#6b7280', minWidth: 0,
                  '&:hover': { borderColor: '#dc2626', color: '#dc2626', bgcolor: '#fef2f2' }
                }}
                title="Reset Filters"
              >
                <RestartAlt />
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Container maxWidth="lg">
        {/* ===== CUISINE CHIPS CAROUSEL ===== */}
        <Box sx={{ mb: 6, pb: 1, overflowX: 'auto', display: 'flex', gap: 1.2, '&::-webkit-scrollbar': { height: 6 } }}>
          {cuisineTypes.map(cuisine => {
            const isSelected = selectedCuisine === cuisine;
            return (
              <Chip
                key={cuisine}
                label={cuisine === 'All' ? '🍽️ All Cuisines' : cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                sx={{
                  py: 2.5, px: 2,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #d97706' : '1px solid #e5e7eb',
                  background: isSelected ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'white',
                  color: isSelected ? 'white' : '#374151',
                  boxShadow: isSelected ? '0 8px 20px rgba(217,119,6,0.3)' : '0 2px 6px rgba(0,0,0,0.03)',
                  '&:hover': {
                    background: isSelected ? 'linear-gradient(135deg, #d97706, #b45309)' : '#fef3c7',
                    color: isSelected ? 'white' : '#92400e',
                    border: '2px solid #fcd34d'
                  }
                }}
              />
            );
          })}
        </Box>

        {/* ===== RESULTS HEADER ===== */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" fontWeight={800} sx={{ fontFamily: '"Playfair Display", serif' }}>
            Matching Restaurants <span style={{ color: '#d97706', fontSize: '1.2rem' }}>({restaurants.length})</span>
          </Typography>
          {(searchTerm || selectedCuisine !== 'All' || minRating > 0) && (
            <Chip
              label="Active Filters Applied (Click to Clear)"
              onDelete={resetFilters}
              color="warning"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {/* ===== RESTAURANTS GRID / SKELETONS / EMPTY ===== */}
        {loading ? (
          <Grid container spacing={3.5}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden', height: 400 }}>
                  <Box className="shimmer" sx={{ height: 220 }} />
                  <Box sx={{ p: 3 }}>
                    <Box className="shimmer" sx={{ height: 24, width: '70%', borderRadius: 1, mb: 1.5 }} />
                    <Box className="shimmer" sx={{ height: 16, width: '40%', borderRadius: 1, mb: 2.5 }} />
                    <Box className="shimmer" sx={{ height: 48, width: '100%', borderRadius: 1 }} />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : restaurants.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Paper elevation={0} sx={{ p: 10, textAlign: 'center', borderRadius: 6, border: '2px dashed #e5e7eb', bgcolor: '#ffffff' }}>
              <FilterAlt sx={{ fontSize: 80, color: '#fcd34d', mb: 2 }} />
              <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Playfair Display", serif', color: '#1f2937' }}>
                No Restaurants Found
              </Typography>
              <Typography variant="body1" color="text.secondary" maxWidth="sm" sx={{ mx: 'auto', mb: 4, lineHeight: 1.6 }}>
                We couldn't find any restaurants matching your specific filters or search terms. Try lowering your minimum rating or switching to "All Cuisines".
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={resetFilters}
                sx={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  fontWeight: 700, px: 4, py: 1.5, borderRadius: 3
                }}
              >
                Clear All Filters
              </Button>
            </Paper>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <Grid container spacing={3.5}>
              {restaurants.map((restaurant, idx) => (
                <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                  <RestaurantCard restaurant={restaurant} index={idx} />
                </Grid>
              ))}
            </Grid>
          </AnimatePresence>
        )}
      </Container>
    </Box>
  );
};

export default RestaurantList;
