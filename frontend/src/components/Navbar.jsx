/**
 * ReserveIQ - Premium Navigation Bar
 * Sticky with backdrop blur, role-based links, animated avatar menu
 */

import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar, Toolbar, Typography, Button, IconButton,
  Menu, MenuItem, Avatar, Box, Container, Chip,
  Tooltip, Badge
} from '@mui/material';
import {
  Menu as MenuIcon, Restaurant, Dashboard, BookOnline,
  Person, Logout, AdminPanelSettings, Store, Search
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { currentUser, logout, hasRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleMobileMenu = (event) => setMobileOpen(event.currentTarget);
  const handleMobileClose = () => setMobileOpen(null);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getDashboardLink = () => {
    if (hasRole('ADMIN')) return '/admin/dashboard';
    if (hasRole('MANAGER')) return '/manager/restaurants';
    return '/dashboard';
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 0.5 }}>
          {/* Logo desktop */}
          <Restaurant sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#f59e0b', fontSize: 28 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 800,
              color: 'white',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              fontFamily: '"Playfair Display", serif'
            }}
          >
            Reserve<span style={{ color: '#f59e0b' }}>IQ</span>
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleMobileMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileOpen}
              open={Boolean(mobileOpen)}
              onClose={handleMobileClose}
              sx={{ display: { xs: 'block', md: 'none' } }}
              PaperProps={{
                elevation: 3,
                sx: { borderRadius: 2, mt: 1.5, minWidth: 200 }
              }}
            >
              <MenuItem component={RouterLink} to="/restaurants" onClick={handleMobileClose}>
                <Restaurant sx={{ mr: 1.5, color: '#d97706' }} /> Restaurants
              </MenuItem>
              {isAuthenticated && (
                <MenuItem component={RouterLink} to={getDashboardLink()} onClick={handleMobileClose}>
                  <Dashboard sx={{ mr: 1.5, color: '#d97706' }} /> Dashboard
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Logo mobile */}
          <Restaurant sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: '#f59e0b' }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 800,
              color: 'white',
              textDecoration: 'none',
              fontFamily: '"Playfair Display", serif'
            }}
          >
            Reserve<span style={{ color: '#f59e0b' }}>IQ</span>
          </Typography>

          {/* Desktop nav */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
            <Button
              component={RouterLink}
              to="/restaurants"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
              startIcon={<Search sx={{ fontSize: 18 }} />}
            >
              Browse Restaurants
            </Button>
            {isAuthenticated && (
              <Button
                component={RouterLink}
                to={getDashboardLink()}
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  '&:hover': { color: 'white', backgroundColor: 'rgba(255,255,255,0.08)' }
                }}
                startIcon={<Dashboard sx={{ fontSize: 18 }} />}
              >
                Dashboard
              </Button>
            )}
          </Box>

          {/* Right side */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isAuthenticated ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 2.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #d97706, #b45309)'
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            ) : (
              <>
                <Chip
                  label={currentUser.role}
                  size="small"
                  sx={{
                    mr: 1,
                    background: currentUser.role === 'ADMIN'
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                      : currentUser.role === 'MANAGER'
                      ? 'linear-gradient(135deg, #0891b2, #0e7490)'
                      : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: 0.5,
                    px: 0.5,
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                />
                <Tooltip title="Account menu">
                  <IconButton onClick={handleMenu} sx={{ p: 0.25 }}>
                    <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                      <Avatar
                        sx={{
                          width: 40, height: 40,
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          border: '2px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        {getInitials(currentUser.fullName)}
                      </Avatar>
                    </motion.div>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 240,
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0, right: 14,
                        width: 10, height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0
                      }
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {currentUser.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {currentUser.email}
                    </Typography>
                  </Box>

                  <MenuItem component={RouterLink} to="/profile" onClick={handleClose} sx={{ py: 1.25 }}>
                    <Person fontSize="small" sx={{ mr: 1.5, color: '#d97706' }} /> My Profile
                  </MenuItem>

                  {hasRole('CUSTOMER') && (
                    <MenuItem component={RouterLink} to="/my-reservations" onClick={handleClose} sx={{ py: 1.25 }}>
                      <BookOnline fontSize="small" sx={{ mr: 1.5, color: '#d97706' }} /> My Reservations
                    </MenuItem>
                  )}
                  {hasRole('MANAGER') && (
                    <MenuItem component={RouterLink} to="/manager/restaurants" onClick={handleClose} sx={{ py: 1.25 }}>
                      <Store fontSize="small" sx={{ mr: 1.5, color: '#d97706' }} /> My Restaurants
                    </MenuItem>
                  )}
                  {hasRole('ADMIN') && (
                    <MenuItem component={RouterLink} to="/admin/dashboard" onClick={handleClose} sx={{ py: 1.25 }}>
                      <AdminPanelSettings fontSize="small" sx={{ mr: 1.5, color: '#d97706' }} /> Admin Panel
                    </MenuItem>
                  )}

                  <Box sx={{ borderTop: '1px solid #f1f5f9', mt: 0.5 }}>
                    <MenuItem onClick={handleLogout} sx={{ py: 1.25, color: '#dc2626' }}>
                      <Logout fontSize="small" sx={{ mr: 1.5 }} /> Sign Out
                    </MenuItem>
                  </Box>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
