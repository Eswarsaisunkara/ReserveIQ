/**
 * ReserveIQ - Premium Reservation Card
 */

import { motion } from 'framer-motion';
import {
  Card, CardContent, Typography, Box, Chip, Button,
  Divider, Avatar
} from '@mui/material';
import {
  Event, AccessTime, People, TableBar,
  CheckCircle, Cancel, Pending, CancelPresentation, Restaurant
} from '@mui/icons-material';

const statusConfig = {
  PENDING: {
    bg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    color: '#92400e',
    icon: <Pending fontSize="small" />,
    label: 'Pending Approval'
  },
  CONFIRMED: {
    bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    color: '#065f46',
    icon: <CheckCircle fontSize="small" />,
    label: 'Confirmed'
  },
  CANCELLED: {
    bg: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    color: '#991b1b',
    icon: <Cancel fontSize="small" />,
    label: 'Cancelled'
  },
  REJECTED: {
    bg: 'linear-gradient(135deg, #fecaca, #fca5a5)',
    color: '#7f1d1d',
    icon: <CancelPresentation fontSize="small" />,
    label: 'Rejected'
  },
  COMPLETED: {
    bg: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
    color: '#3730a3',
    icon: <CheckCircle fontSize="small" />,
    label: 'Completed'
  }
};

const ReservationCard = ({ reservation, viewMode = 'customer', onCancel, onApprove, onReject, index = 0 }) => {
  const status = statusConfig[reservation.status] || statusConfig.PENDING;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card
        className={`reservation-card status-${reservation.status}`}
        elevation={1}
        sx={{ mb: 2.5, borderRadius: 3, overflow: 'visible' }}
      >
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar sx={{
                width: 52, height: 52,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                boxShadow: '0 4px 12px rgba(217,119,6,0.3)'
              }}>
                <Restaurant />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="700" sx={{ fontFamily: '"Playfair Display", serif' }}>
                  {reservation.restaurantName}
                </Typography>
                {viewMode === 'manager' && (
                  <Typography variant="body2" color="text.secondary">
                    <strong style={{ color: '#1f2937' }}>{reservation.customerName}</strong>
                    {' • '}{reservation.customerEmail}
                  </Typography>
                )}
              </Box>
            </Box>
            <Chip
              icon={status.icon}
              label={status.label}
              sx={{
                background: status.bg,
                color: status.color,
                fontWeight: 700,
                textTransform: 'capitalize',
                px: 1,
                py: 0.5,
                fontSize: '0.8rem',
                height: 32
              }}
            />
          </Box>

          <Divider sx={{ mb: 2.5, borderStyle: 'dashed' }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{
                width: 38, height: 38,
                borderRadius: 2,
                bgcolor: '#fffbeb',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Event sx={{ color: '#d97706', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 0.5 }}>
                  Date
                </Typography>
                <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.85rem' }}>
                  {new Date(reservation.reservationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{
                width: 38, height: 38, borderRadius: 2, bgcolor: '#fffbeb',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <AccessTime sx={{ color: '#d97706', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 0.5 }}>Time</Typography>
                <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.85rem' }}>
                  {reservation.reservationTime}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{
                width: 38, height: 38, borderRadius: 2, bgcolor: '#fffbeb',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <People sx={{ color: '#d97706', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 0.5 }}>Guests</Typography>
                <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.85rem' }}>
                  {reservation.guestCount} {reservation.guestCount === 1 ? 'person' : 'people'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{
                width: 38, height: 38, borderRadius: 2, bgcolor: '#fffbeb',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <TableBar sx={{ color: '#d97706', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600, letterSpacing: 0.5 }}>Table</Typography>
                <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.85rem' }}>
                  #{reservation.tableNumber}
                </Typography>
              </Box>
            </Box>
          </Box>

          {reservation.specialRequests && (
            <Box sx={{ mt: 2.5, p: 2, bgcolor: '#fffbeb', borderRadius: 2, border: '1px dashed #fcd34d' }}>
              <Typography variant="caption" color="#92400e" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 0.5 }}>
                Special Requests
              </Typography>
              <Typography variant="body2" color="#78350f" sx={{ mt: 0.5 }}>
                {reservation.specialRequests}
              </Typography>
            </Box>
          )}
        </CardContent>

        {/* Action buttons */}
        {(viewMode === 'customer' && (reservation.status === 'PENDING' || reservation.status === 'CONFIRMED')) ||
         (viewMode === 'manager' && reservation.status === 'PENDING') ? (
          <Box sx={{
            px: 3, pb: 3,
            display: 'flex', gap: 1.5, flexWrap: 'wrap',
            borderTop: '1px solid #f3f4f6',
            pt: 2
          }}>
            {viewMode === 'customer' && (
              <Button
                variant="outlined"
                color="error"
                size="medium"
                startIcon={<Cancel />}
                onClick={() => onCancel && onCancel(reservation.id)}
                sx={{ borderRadius: 2, px: 2.5 }}
              >
                Cancel Booking
              </Button>
            )}

            {viewMode === 'manager' && reservation.status === 'PENDING' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="medium"
                  startIcon={<CheckCircle />}
                  onClick={() => onApprove && onApprove(reservation.id)}
                  sx={{
                    borderRadius: 2, px: 2.5,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' }
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="medium"
                  startIcon={<CancelPresentation />}
                  onClick={() => onReject && onReject(reservation.id)}
                  sx={{ borderRadius: 2, px: 2.5 }}
                >
                  Reject
                </Button>
              </>
            )}
          </Box>
        ) : null}
      </Card>
    </motion.div>
  );
};

export default ReservationCard;
