/**
 * ReserveIQ - Register Page
 */

import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import {
  Container, Paper, Box, Typography, TextField, Button,
  InputAdornment, IconButton
} from '@mui/material';
import {
  Email, Lock, Person, Visibility, VisibilityOff, Restaurant, Phone,
  HowToReg
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
      return;
    }
    if (formData.password.length < 6) {
      enqueueSnackbar('Password must be at least 6 characters', { variant: 'warning' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      enqueueSnackbar('Passwords do not match', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      enqueueSnackbar('Welcome to ReserveIQ! Your account has been created.', { variant: 'success' });
      navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar(err.message || 'Registration failed', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      py: 6,
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fed7aa 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,6,0.2), transparent 70%)' }} />
      <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(146,64,14,0.15), transparent 70%)' }} />

      <Container maxWidth="sm" sx={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={8} sx={{ p: { xs: 3.5, md: 5 }, borderRadius: 4, background: 'rgba(255,255,255,0.95)' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{
                width: 72, height: 72, borderRadius: '50%', mb: 2,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto',
                boxShadow: '0 10px 30px rgba(217,119,6,0.4)'
              }}>
                <Restaurant sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join ReserveIQ and start booking tables instantly
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth label="Full Name" name="fullName"
                value={formData.fullName} onChange={handleChange}
                margin="normal" required size="medium"
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><Person color="action" /></InputAdornment>)
                }}
              />
              <TextField
                fullWidth label="Email Address" name="email" type="email"
                value={formData.email} onChange={handleChange}
                margin="normal" required size="medium"
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><Email color="action" /></InputAdornment>)
                }}
              />
              <TextField
                fullWidth label="Phone Number (optional)" name="phone"
                value={formData.phone} onChange={handleChange}
                margin="normal" size="medium"
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><Phone color="action" /></InputAdornment>)
                }}
              />
              <TextField
                fullWidth label="Password" name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password} onChange={handleChange}
                margin="normal" required size="medium"
                helperText="Must be at least 6 characters"
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><Lock color="action" /></InputAdornment>),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                fullWidth label="Confirm Password" name="confirmPassword"
                type="password"
                value={formData.confirmPassword} onChange={handleChange}
                margin="normal" required size="medium"
              />

              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={loading}
                endIcon={!loading && <HowToReg />}
                sx={{
                  mt: 3, mb: 2, py: 1.4, fontSize: '1rem', borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(217,119,6,0.3)'
                }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Box>

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Already have an account?{' '}
              <RouterLink to="/login" style={{ color: '#d97706', fontWeight: 700, textDecoration: 'none' }}>
                Sign in here →
              </RouterLink>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;
