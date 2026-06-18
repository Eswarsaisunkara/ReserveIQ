/**
 * ReserveIQ - Dashboard Layout
 * ------------------------------
 * Layout for authenticated dashboard pages.
 * Features a responsive sidebar that changes menu items based on role.
 * Uses Material UI's Drawer for navigation.
 */

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, useMediaQuery, Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Menu as MenuIcon, Restaurant, MenuBook, People, Store,
  TableBar, Person, Logout, AdminPanelSettings,
  Dashboard as DashboardIcon, ChevronLeft
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';

const drawerWidth = 260;

const DashboardLayout = () => {
  const { currentUser, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Build menu items based on user role
  const getMenuItems = () => {
    const items = [];

    // All roles see profile
    items.push({ text: 'My Profile', icon: <Person />, path: '/profile' });

    if (hasRole('CUSTOMER')) {
      items.unshift(
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'My Reservations', icon: <MenuBook />, path: '/my-reservations' },
        { text: 'Browse Restaurants', icon: <Restaurant />, path: '/restaurants' }
      );
    }

    if (hasRole('MANAGER')) {
      items.unshift(
        { text: 'My Restaurants', icon: <Store />, path: '/manager/restaurants' },
        { text: 'Reservations', icon: <MenuBook />, path: '/manager/reservations' }
      );
    }

    if (hasRole('ADMIN')) {
      items.unshift(
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Manage Users', icon: <People />, path: '/admin/users' },
        { text: 'All Restaurants', icon: <Restaurant />, path: '/restaurants' }
      );
    }

    return items;
  };

  const menuItems = getMenuItems();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleNav = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = currentUser?.fullName
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box sx={{
        p: 2,
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Restaurant sx={{ color: '#d97706' }} />
        <Typography variant="h6" fontWeight="bold">
          Reserve<span style={{ color: '#d97706' }}>IQ</span>
        </Typography>
        {isMobile && (
          <IconButton sx={{ ml: 'auto' }} onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      {/* User info at top */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: '#d97706', mx: 'auto', mb: 1 }}>
          {initials}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="600">
          {currentUser?.fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {currentUser?.email}
        </Typography>
        <Chip
          label={currentUser?.role}
          size="small"
          sx={{
            backgroundColor:
              currentUser?.role === 'ADMIN' ? '#dc2626' :
              currentUser?.role === 'MANAGER' ? '#0891b2' : '#059669',
            color: 'white',
            fontWeight: 600
          }}
        />
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNav(item.path)}
                sx={{
                  borderRadius: 1,
                  backgroundColor: isActive ? '#fef3c7' : 'transparent',
                  color: isActive ? '#92400e' : 'inherit',
                  '&:hover': {
                    backgroundColor: isActive ? '#fef3c7' : '#f3f4f6'
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#d97706' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout button at bottom */}
      <Box sx={{ p: 1, borderTop: '1px solid #e5e7eb' }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 1, color: '#dc2626', '&:hover': { backgroundColor: '#fee2e2' } }}
          >
            <ListItemIcon sx={{ color: '#dc2626', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Top App Bar (mobile only) */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'black',
          boxShadow: 1,
          display: { md: 'none' }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Restaurant sx={{ color: '#d97706' }} />
            <Typography variant="h6" fontWeight="bold">
              Reserve<span style={{ color: '#d97706' }}>IQ</span>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar / Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #e5e7eb'
            }
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, md: 0 }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
