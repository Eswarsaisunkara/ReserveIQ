/**
 * ReserveIQ - Restaurant List Page
 * ----------------------------------
 * Displays all restaurants with search by name and cuisine filter.
 * GET /api/restaurants?search=...&cuisine=...
 */

import { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Grid, Box, Chip,
  InputAdornment, CircularProgress, Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { getAllRestaurants } from '../../services/restaurantService.js';
import { cuisineTypes } from '../../data/mockData.js';
import RestaurantCard from '../../components/RestaurantCard.jsx';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch restaurants whenever search or cuisine changes
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await getAllRestaurants(searchTerm, selectedCuisine);
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search a tiny bit
    const timer = setTimeout(fetchRestaurants, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCuisine]);

  return (
    <Box>
      {/* Header banner */}
      <Box sx={{
        background: 'linear-gradient(135deg, #92400e 0%, #78350f 100%)',
        color: 'white',
        py: 6
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Discover Restaurants
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Find and book the perfect table for any occasion
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search bar */}
        <TextField
          fullWidth
          placeholder="Search by restaurant name, cuisine, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />

        {/* Cuisine filter chips */}
        <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {cuisineTypes.map(cuisine => (
            <Chip
              key={cuisine}
              label={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              color={selectedCuisine === cuisine ? 'primary' : 'default'}
              sx={selectedCuisine === cuisine ? {
                backgroundColor: '#d97706',
                '&:hover': { backgroundColor: '#b45309' }
              } : {}}
            />
          ))}
        </Box>

        {/* Results count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Showing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
          {selectedCuisine !== 'All' && ` serving ${selectedCuisine} cuisine`}
          {searchTerm && ` matching "${searchTerm}"`}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#d97706' }} />
          </Box>
        ) : restaurants.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No restaurants found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or cuisine filter.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {restaurants.map(restaurant => (
              <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default RestaurantList;
