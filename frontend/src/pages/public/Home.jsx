/**
 * ReserveIQ - Premium Home / Landing Page
 * Hero, stats, features, featured restaurants, CTA with smooth animations
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Typography, Button, Container, Grid, Card, CardContent,
  Paper, Rating, Chip, Avatar, AvatarGroup
} from '@mui/material';
import {
  Search, EventAvailable, TableRestaurant, RateReview,
  Security, Star, TrendingUp, ArrowForward, CheckCircle
} from '@mui/icons-material';
import { mockRestaurants } from '../../data/mockData.js';
import RestaurantCard from '../../components/RestaurantCard.jsx';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const Home = () => {
  const navigate = useNavigate();
  const featuredRestaurants = mockRestaurants.slice(0, 3);

  const features = [
    {
      icon: <Search />,
      title: 'Discover Restaurants',
      description: 'Browse and search through curated top restaurants. Filter by cuisine, rating, and location.',
      color: '#d97706'
    },
    {
      icon: <EventAvailable />,
      title: 'Instant Reservations',
      description: 'Book a table in seconds. Pick your date, time, and party size — no phone calls needed.',
      color: '#0891b2'
    },
    {
      icon: <TableRestaurant />,
      title: 'Table Management',
      description: 'Managers get a full dashboard to handle tables, approve bookings, and seat guests efficiently.',
      color: '#7c3aed'
    },
    {
      icon: <RateReview />,
      title: 'Reviews & Ratings',
      description: 'Share your dining experience. Help others find great food and help restaurants improve.',
      color: '#059669'
    },
    {
      icon: <Security />,
      title: 'Secure Platform',
      description: 'JWT authentication keeps accounts safe. Role-based access for customers, managers, and admins.',
      color: '#dc2626'
    },
    {
      icon: <TrendingUp />,
      title: 'Smart Queue System',
      description: 'Join a virtual queue and get notified when your table is ready. No more waiting by the door.',
      color: '#2563eb'
    }
  ];

  return (
    <Box>
      {/* ===== HERO SECTION ===== */}
      <Box className="hero-gradient" sx={{ py: { xs: 10, md: 16 }, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                <motion.div variants={fadeInUp}>
                  <Chip
                    label="✨ #1 Restaurant Reservation Platform"
                    sx={{
                      mb: 3,
                      bgcolor: 'rgba(251,191,36,0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(251,191,36,0.3)',
                      fontWeight: 600
                    }}
                  />
                </motion.div>

                <motion.div variants={fadeInUp} custom={1}>
                  <Typography
                    variant="h1"
                    fontWeight={800}
                    gutterBottom
                    sx={{
                      fontSize: { xs: '2.4rem', sm: '3rem', md: '4rem' },
                      lineHeight: 1.05,
                      fontFamily: '"Playfair Display", serif',
                      letterSpacing: '-0.03em'
                    }}
                  >
                    Reserve Your Table,<br />
                    <span style={{
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Savor Every Moment
                    </span>
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp} custom={2}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 4, opacity: 0.9, fontWeight: 300, maxWidth: 560, lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.15rem' } }}
                  >
                    The smartest way to discover and book tables at the best restaurants in town.
                    No calls, no waiting — just great food and unforgettable experiences.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeInUp} custom={3}>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/restaurants')}
                      endIcon={<Search />}
                      sx={{
                        bgcolor: 'white',
                        color: '#78350f',
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        borderRadius: 3,
                        '&:hover': { bgcolor: '#fef3c7', transform: 'translateY(-2px)' }
                      }}
                    >
                      Find a Restaurant
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/register')}
                      endIcon={<ArrowForward />}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.4)',
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        borderRadius: 3,
                        backdropFilter: 'blur(8px)',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Join ReserveIQ
                    </Button>
                  </Box>
                </motion.div>

                <motion.div variants={fadeInUp} custom={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <AvatarGroup sx={{ '& .MuiAvatar-root': { border: '2px solid rgba(255,255,255,0.15)', width: 38, height: 38 } }}>
                      {[1,2,3,4,5].map(i => (
                        <Avatar key={i} src={`https://i.pravatar.cc/40?img=${i + 10}`} />
                      ))}
                    </AvatarGroup>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} sx={{ color: '#fbbf24', fontSize: 18 }} />
                        ))}
                        <Typography variant="body2" sx={{ ml: 1, fontWeight: 700 }}>4.9/5</Typography>
                      </Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Trusted by 50,000+ diners
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700"
                  alt="Fine dining experience"
                  sx={{
                    width: '100%',
                    height: 500,
                    objectFit: 'cover',
                    borderRadius: 6,
                    boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)',
                  }}
                />
                {/* Floating card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(16px)',
                    padding: 16,
                    borderRadius: 16,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}>
                      <CheckCircle />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: '#1f2937', fontWeight: 700 }}>
                        Booking Confirmed
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Tonight at 7:30 PM · Table for 4
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ===== STATS BAR (floating) ===== */}
      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Paper elevation={4} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, background: 'white' }}>
            <Grid container spacing={2} textAlign="center">
              {[
                { value: '500+', label: 'Premium Restaurants', color: '#d97706' },
                { value: '50K+', label: 'Happy Diners', color: '#0891b2' },
                { value: '200K+', label: 'Reservations Booked', color: '#059669' },
                { value: '4.9★', label: 'Average Rating', color: '#f59e0b' }
              ].map((stat, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Typography variant="h3" fontWeight={800} sx={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}aa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: { xs: '2rem', md: '2.8rem' }, fontFamily: '"Playfair Display", serif' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {stat.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>
      </Container>

      {/* ===== FEATURES SECTION ===== */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" sx={{ mb: 7 }}>
            <Chip
              label="WHY CHOOSE US"
              sx={{ mb: 2, bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700, letterSpacing: 1 }}
            />
            <Typography variant="h2" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
              Everything You Need to <span className="text-gradient-amber">Dine Smarter</span>
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth="md" sx={{ mx: 'auto', fontSize: '1.1rem', lineHeight: 1.7 }}>
              From discovery to dessert, ReserveIQ handles every part of the reservation journey beautifully.
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #f1f5f9',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: feature.color + '40',
                      boxShadow: `0 12px 32px -8px ${feature.color}30`,
                      transform: 'translateY(-6px)'
                    }
                  }}
                >
                  <Box sx={{
                    mb: 2.5,
                    width: 56, height: 56,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    background: `${feature.color}15`,
                    color: feature.color
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ===== FEATURED RESTAURANTS ===== */}
      <Box sx={{
        background: 'linear-gradient(180deg, #fffbeb 0%, #fef3c730 100%)',
        py: 10
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Chip
                  label="TRENDING NOW"
                  size="small"
                  sx={{ mb: 1.5, bgcolor: '#d97706', color: 'white', fontWeight: 700, letterSpacing: 0.5 }}
                />
                <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                  Featured Restaurants
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                  Hand-picked venues our guests are loving right now
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/restaurants')}
                sx={{ borderRadius: 3, px: 3, py: 1.3 }}
              >
                View All
              </Button>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {featuredRestaurants.map((restaurant, idx) => (
              <Grid item xs={12} md={4} key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} index={idx} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== HOW IT WORKS ===== */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography variant="h2" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Book a Table in <span className="text-gradient-amber">3 Simple Steps</span>
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {[
            { step: '01', title: 'Search & Discover', desc: 'Browse restaurants by cuisine, rating, or location.' },
            { step: '02', title: 'Pick Date & Time', desc: 'Choose your preferred date, time, and party size.' },
            { step: '03', title: 'Enjoy Your Meal', desc: 'Show up and enjoy — your table will be ready and waiting.' }
          ].map((s, i) => (
            <Grid item xs={12} md={4} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Card elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #f1f5f9', textAlign: 'center', height: '100%' }}>
                  <Typography variant="h1" sx={{
                    fontSize: '4rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: '"Playfair Display", serif',
                    lineHeight: 1,
                    mb: 2
                  }}>
                    {s.step}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
                    {s.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {s.desc}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ===== FINAL CTA ===== */}
      <Box sx={{ position: 'relative', overflow: 'hidden', py: 12 }}>
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #1f2937 0%, #78350f 50%, #451a03 100%)',
        }} />
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=1600)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.15, mixBlendMode: 'overlay'
        }} />
        <Container maxWidth="md" sx={{ position: 'relative', textAlign: 'center', color: 'white' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" fontWeight={800} gutterBottom sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, fontFamily: '"Playfair Display", serif' }}>
              Ready to Dine Smarter?
            </Typography>
            <Typography variant="h6" sx={{ mb: 5, opacity: 0.9, fontWeight: 300, lineHeight: 1.6 }}>
              Join thousands of food lovers booking smarter with ReserveIQ.
              Free to sign up, forever.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              endIcon={<ArrowForward />}
              sx={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#78350f',
                px: 6,
                py: 1.75,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 3,
                boxShadow: '0 10px 30px rgba(251,191,36,0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 15px 40px rgba(251,191,36,0.5)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Get Started Free
            </Button>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
