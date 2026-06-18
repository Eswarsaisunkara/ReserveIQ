/**
 * ReserveIQ - User Management (Admin)
 * --------------------------------------
 * Admins can view all users, change their roles, or delete them.
 *
 * GET    /api/users
 * PUT    /api/users/:id/role
 * DELETE /api/users/:id
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip,
  CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button, Menu, MenuItem,
  ListItemIcon, Divider
} from '@mui/material';
import {
  People, Delete as DeleteIcon, MoreVert, AdminPanelSettings,
  Storefront, Person as PersonIcon
} from '@mui/icons-material';
import { getAllUsers, updateUserRole, deleteUser } from '../../services/userService.js';

const roleColors = {
  CUSTOMER: { bg: '#d1fae5', color: '#065f46' },
  MANAGER: { bg: '#cffafe', color: '#155e75' },
  ADMIN: { bg: '#fee2e2', color: '#991b1b' }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuUser, setMenuUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const loadData = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleMenuOpen = (e, user) => {
    setMenuAnchor(e.currentTarget);
    setMenuUser(user);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuUser(null);
  };

  const handleChangeRole = async (newRole) => {
    try {
      await updateUserRole(menuUser.id, newRole);
      enqueueSnackbar(`Role updated to ${newRole}`, { variant: 'success' });
      handleMenuClose();
      loadData();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteDialog);
      enqueueSnackbar('User deleted successfully', { variant: 'info' });
      setDeleteDialog(null);
      loadData();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          <People sx={{ mr: 1, verticalAlign: 'middle', color: '#d97706' }} />
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage all platform users and their roles
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress sx={{ color: '#d97706' }} /></Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#fef3c7' }}>
              <TableRow>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Joined</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => {
                const c = roleColors[u.role];
                return (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Typography fontWeight="600">{u.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">{u.phone || 'No phone'}</Typography>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role}
                        size="small"
                        sx={{ backgroundColor: c.bg, color: c.color, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(u.createdAt)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, u)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            Actions for <strong>{menuUser?.fullName}</strong>
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleChangeRole('CUSTOMER')}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Set as Customer
        </MenuItem>
        <MenuItem onClick={() => handleChangeRole('MANAGER')}>
          <ListItemIcon><Storefront fontSize="small" /></ListItemIcon>
          Set as Manager
        </MenuItem>
        <MenuItem onClick={() => handleChangeRole('ADMIN')}>
          <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
          Set as Admin
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setDeleteDialog(menuUser.id); handleMenuClose(); }} sx={{ color: '#dc2626' }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#dc2626' }} /></ListItemIcon>
          Delete User
        </MenuItem>
      </Menu>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete User?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This will remove all their
            reservations and reviews as well. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
