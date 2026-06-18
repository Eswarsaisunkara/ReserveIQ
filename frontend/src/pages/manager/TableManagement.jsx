/**
 * ReserveIQ - Table Management Page (Manager)
 * ----------------------------------------------
 * Managers can add, edit, and delete tables for a specific restaurant.
 * Accessed via /manager/tables/:restaurantId
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import {
  Box, Typography, Button, Paper, Grid, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, CircularProgress
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  ArrowBack, TableBar
} from '@mui/icons-material';
import {
  getTablesByRestaurant, createTable, updateTable, deleteTable
} from '../../services/tableService.js';
import { getRestaurantById } from '../../services/restaurantService.js';

const statusOptions = [
  { value: 'AVAILABLE', label: 'Available', color: 'success' },
  { value: 'RESERVED', label: 'Reserved', color: 'warning' },
  { value: 'OCCUPIED', label: 'Occupied', color: 'info' },
  { value: 'MAINTENANCE', label: 'Maintenance', color: 'error' }
];

const emptyForm = { tableNumber: '', capacity: 2, status: 'AVAILABLE' };

const TableManagement = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [tables, setTables] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tablesData, restaurantData] = await Promise.all([
        getTablesByRestaurant(restaurantId),
        getRestaurantById(restaurantId)
      ]);
      setTables(tablesData);
      setRestaurant(restaurantData);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [restaurantId]);

  const handleOpenDialog = (table = null) => {
    if (table) {
      setEditingId(table.id);
      setFormData({
        tableNumber: table.tableNumber,
        capacity: table.capacity,
        status: table.status
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
    if (!formData.tableNumber || !formData.capacity) {
      enqueueSnackbar('Please fill all required fields', { variant: 'warning' });
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateTable(editingId, formData);
        enqueueSnackbar('Table updated successfully', { variant: 'success' });
      } else {
        await createTable({ ...formData, restaurantId });
        enqueueSnackbar('Table added successfully', { variant: 'success' });
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
      await deleteTable(deleteDialog);
      enqueueSnackbar('Table deleted', { variant: 'info' });
      setDeleteDialog(null);
      loadData();
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
  };

  const getStatusChip = (status) => {
    const s = statusOptions.find(o => o.value === status) || statusOptions[0];
    return <Chip label={s.label} color={s.color} size="small" />;
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#d97706' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/manager/restaurants')}
        sx={{ mb: 2, color: '#d97706' }}
      >
        Back to Restaurants
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            <TableBar sx={{ mr: 1, verticalAlign: 'middle', color: '#d97706' }} />
            Table Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {restaurant?.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: '#d97706', '&:hover': { backgroundColor: '#b45309' } }}
        >
          Add Table
        </Button>
      </Box>

      {/* Summary stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" color="#d97706">{tables.length}</Typography>
            <Typography variant="body2" color="text.secondary">Total Tables</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" color="#059669">
              {tables.filter(t => t.status === 'AVAILABLE').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Available</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" color="#d97706">
              {tables.filter(t => t.status === 'RESERVED').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Reserved</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" fontWeight="bold" color="#dc2626">
              {tables.filter(t => t.status === 'MAINTENANCE').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Maintenance</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tables grid */}
      <Grid container spacing={2}>
        {tables.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <TableBar sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No tables configured yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add tables to start accepting reservations.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()} sx={{ backgroundColor: '#d97706' }}>
                Add First Table
              </Button>
            </Paper>
          </Grid>
        ) : (
          tables.map(table => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <TableBar sx={{ fontSize: 48, color: '#d97706', mb: 1 }} />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Table #{table.tableNumber}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Seats {table.capacity} guests
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {getStatusChip(table.status)}
                </Box>
                <Box>
                  <IconButton size="small" color="warning" onClick={() => handleOpenDialog(table)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => setDeleteDialog(table.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight="bold">
          {editingId ? 'Edit Table' : 'Add New Table'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Table Number" name="tableNumber" type="number"
                value={formData.tableNumber} onChange={handleChange} required InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Capacity (seats)" name="capacity" type="number" select
                value={formData.capacity} onChange={handleChange} required
              >
                {[1,2,3,4,5,6,8,10,12].map(n => (
                  <MenuItem key={n} value={n}>{n} guests</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Status" name="status" select
                value={formData.status} onChange={handleChange} required
              >
                {statusOptions.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving} sx={{ backgroundColor: '#d97706' }}>
            {saving ? 'Saving...' : (editingId ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Table?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure? This may affect existing reservations.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableManagement;
