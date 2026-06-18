/**
 * ReserveIQ - Main Layout (Public Pages)
 * ----------------------------------------
 * Wraps public-facing pages (Home, Restaurants, etc.)
 * with the Navbar at the top and a footer at the bottom.
 */

import { Outlet } from 'react-router-dom';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Restaurant } from '@mui/icons-material';
import Navbar from '../components/Navbar.jsx';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <Navbar />

      {/* Main page content renders here via React Router's Outlet */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#1f2937',
          color: 'white',
          py: 4,
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Restaurant sx={{ color: '#d97706' }} />
              <Typography variant="h6" fontWeight="bold">
                Reserve<span style={{ color: '#d97706' }}>IQ</span>
              </Typography>
            </Box>
            <Typography variant="body2" color="gray.400">
              © 2025 ReserveIQ. Smart Restaurant Reservation Platform.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <MuiLink href="#" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>
                About
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>
                Contact
              </MuiLink>
              <MuiLink href="#" color="inherit" underline="hover" sx={{ fontSize: '0.875rem' }}>
                For Restaurants
              </MuiLink>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
