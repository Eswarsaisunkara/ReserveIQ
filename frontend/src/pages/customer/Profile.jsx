/**
 * ReserveIQ - Profile Page
 * ---------------------------
 * Allows any authenticated user to view and update their profile information.
 * PUT /api/users/:id (simplified - updates name/phone only)
 */

import { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, Avatar, Grid, Alert, CircularProgress
} from '@mui/material';
import { Person as PersonIcon, Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile({
        fullName: formData.fullName,
        phone: formData.phone
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = currentUser?.fullName
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Box maxWidth="md">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>

      <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
        {/* Avatar + role display */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#d97706', fontSize: '2rem' }}>
            {initials || <PersonIcon sx={{ fontSize: 40 }} />}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {currentUser.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentUser.email}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'inline-block',
                mt: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                backgroundColor:
                  currentUser.role === 'ADMIN' ? '#fee2e2' :
                  currentUser.role === 'MANAGER' ? '#cffafe' : '#d1fae5',
                color:
                  currentUser.role === 'ADMIN' ? '#991b1b' :
                  currentUser.role === 'MANAGER' ? '#155e75' : '#065f46',
                fontWeight: 600
              }}
            >
              {currentUser.role}
            </Typography>
          </Box>
        </Box>

        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSave}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1-555-0123"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Member Since"
                value={currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                disabled
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ backgroundColor: '#d97706', '&:hover': { backgroundColor: '#b45309' } }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
