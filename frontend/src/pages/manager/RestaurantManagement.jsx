/**
 * ReserveIQ - Restaurant Management (Manager)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Grid, CircularProgress, Card, CardContent
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  TableBar, Visibility, Store, RestaurantMenu
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  getAllRestaurants, createRestaurant, updateRestaurant, deleteRestaurant
} from '../../services/restaurantService.js';

const emptyForm = {
  name: '', description: '', cuisine: '', address: '',
  phoneNumber: '', openingTime: '11:00', closingTime: '22:00', imageUrl: ''
};

const RestaurantManagement = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const loadData = () => {
    setLoading(true);
    getAllRestaurants()
      .then(setRestaurants)
      .catch(err => enqueueSnackbar(err.message, { variant: 'error' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenDialog = (restaurant = null) => {
    if (restaurant) {
      setEditingId(restaurant.id);
      setFormData({
        name: restaurant.name, description: restaurant.description,
        cuisine: restaurant.cuisine, address: restaurant.address,
        phoneNumber: restaurant.phoneNumber, openingTime: restaurant.openingTime,
        closingTime: restaurant.closingTime, imageUrl: restaurant.imageUrl || ''
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.cuisine) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateRestaurant(editingId, formData);
        enqueueSnackbar('Restaurant updated successfully', { variant: 'success' });
      } else {
        await createRestaurant({ ...formData, managerId: currentUser.id });
        enqueueSnackbar('Restaurant added successfully!', { variant: 'success' });
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRestaurant(deleteDialog);
      enqueueSnackbar('Restaurant deleted', { variant: 'info' });
      setDeleteDialog(null);
      loadData();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  return (
    <Box>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
              <Store sx={{ mr: 1, verticalAlign: 'middle', color: '#d97706' }} />
              My Restaurants
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your restaurant listings and table layouts
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2 }}
          >
            Add Restaurant
          </Button>
        </Box>
      </motion.div>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: '#d97706' }} /></Box>
      ) : restaurants.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
          <Store sx={{ fontSize: 80, color: '#fcd34d', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif' }}>
            No restaurants yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Add your first restaurant to start accepting reservations.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} size="large" onClick={() => handleOpenDialog()} sx={{ borderRadius: 2 }}>
            Add Your First Restaurant
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ background: 'linear-gradient(90deg, #fef3c7, #fffbeb)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Restaurant</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Cuisine</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hours</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurants.map((r, idx) => (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box component="img" src={r.imageUrl} alt={r.name}
                        sx={{ width: 56, height: 56, borderRadius: 2, objectFit: 'cover' }} />
                      <Box>
                        <Typography fontWeight={700} sx={{ fontFamily: '"Playfair Display", serif' }}>{r.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.address}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={r.cuisine} size="small" sx={{ background: '#fef3c7', color: '#92400e', fontWeight: 600 }} />
                  </TableCell>
                  <TableCell>{r.openingTime} – {r.closingTime}</TableCell>
                  <TableCell>⭐ {r.averageRating?.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="info" onClick={() => navigate(`/restaurants/${r.id}`)}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => navigate(`/manager/tables/${r.id}`)}>
                      <TableBar />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#d97706' }} onClick={() => handleOpenDialog(r)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteDialog(r.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, pb: 1 }}>
          {editingId ? 'Edit Restaurant' : 'Add New Restaurant'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Restaurant Name" name="name" value={formData.name} onChange={handleChange} required size="medium" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Cuisine Type" name="cuisine" value={formData.cuisine} onChange={handleChange} required placeholder="Italian, Japanese..." size="medium" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required size="medium" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} required size="medium" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Opening Time" name="openingTime" type="time" value={formData.openingTime} onChange={handleChange} required InputLabelProps={{ shrink: true }} size="medium" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Closing Time" name="closingTime" type="time" value={formData.closingTime} onChange={handleChange} required InputLabelProps={{ shrink: true }} size="medium" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." size="medium" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} required size="medium" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} size="large">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving} size="large">
            {saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Delete Restaurant?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            This will permanently remove the restaurant, tables, and associated reservations.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteDialog(null)} variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantManagement;
