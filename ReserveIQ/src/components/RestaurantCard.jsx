/**
 * ReserveIQ - Premium Restaurant Card
 * Smooth animations with framer-motion, gradient overlays, refined hover states
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card, CardMedia, CardContent, CardActions, Typography,
  Button, Box, Chip, Rating
} from '@mui/material';
import {
  AccessTime, LocationOn, Star, ArrowForward
} from '@mui/icons-material';

const RestaurantCard = ({ restaurant, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        className="restaurant-card"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          bgcolor: '#ffffff'
        }}
      >
        {/* Image with gradient overlay */}
        <Box className="card-media-wrapper" sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
          <CardMedia
            component="img"
            image={restaurant.imageUrl}
            alt={restaurant.name}
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />
          {/* Top gradient for cuisine chip */}
          <Box sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
            pointerEvents: 'none'
          }} />
          {/* Bottom gradient for text */}
          <Box sx={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '40%',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
            pointerEvents: 'none'
          }} />

          {/* Cuisine chip top-left */}
          <Chip
            label={restaurant.cuisine}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'rgba(255,255,255,0.95)',
              color: '#92400e',
              fontWeight: 700,
              fontSize: '0.7rem',
              backdropFilter: 'blur(8px)'
            }}
          />

          {/* Rating badge top-right */}
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              px: 1.25,
              py: 0.4,
              display: 'flex',
              alignItems: 'center',
              gap: 0.4
            }}
          >
            <Star sx={{ color: '#f59e0b', fontSize: 16 }} />
            <Typography variant="body2" fontWeight={700} color="#1f2937">
              {restaurant.averageRating?.toFixed(1) || 'N/A'}
            </Typography>
          </Box>

          {/* Restaurant name overlay at bottom */}
          <Box sx={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                fontSize: '1.2rem',
                lineHeight: 1.2,
                fontFamily: '"Playfair Display", serif'
              }}
            >
              {restaurant.name}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, px: 2.5, py: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 40,
              lineHeight: 1.4
            }}
          >
            {restaurant.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
            <LocationOn sx={{ color: '#d97706', fontSize: 16 }} />
            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: '85%' }}>
              {restaurant.address}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <AccessTime sx={{ color: '#d97706', fontSize: 16 }} />
            <Typography variant="caption" color="text.secondary">
              {restaurant.openingTime} – {restaurant.closingTime}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate(`/restaurants/${restaurant.id}`)}
            endIcon={<ArrowForward />}
            sx={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              py: 1,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #d97706, #b45309)'
              }
            }}
          >
            Reserve Now
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;
