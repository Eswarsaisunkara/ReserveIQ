/**
 * ReserveIQ - Premium Review Card
 */

import { motion } from 'framer-motion';
import { Paper, Box, Typography, Rating, Avatar } from '@mui/material';

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const ReviewCard = ({ review, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          borderRadius: 3,
          border: '1px solid #f1f5f9',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            borderColor: '#fde68a',
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{
            width: 48, height: 48,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            mr: 2,
            fontWeight: 700,
            fontSize: '1rem'
          }}>
            {getInitials(review.userName)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="700" sx={{ fontFamily: '"Playfair Display", serif' }}>
              {review.userName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {formatDate(review.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Rating value={review.rating} readOnly precision={1} size="medium" />
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontStyle: 'italic' }}>
          "{review.comment}"
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default ReviewCard;
