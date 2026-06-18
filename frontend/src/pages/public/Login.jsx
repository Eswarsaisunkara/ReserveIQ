/**
 * ReserveIQ - Login Page with smooth animations
 */

import { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import {
  Container, Paper, Box, Typography, TextField, Button,
  InputAdornment, IconButton, Grid, Divider
} from '@mui/material';
import {
  Email, Lock, Visibility, VisibilityOff, Restaurant, Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const from = location.state?.from?.pathname;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      enqueueSnackbar('Please fill in all fields', { variant: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      enqueueSnackbar(`Welcome back, ${user.fullName.split(' ')[0]}!`, { variant: 'success' });

      if (from) navigate(from, { replace: true });
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'MANAGER') navigate('/manager/restaurants');
      else navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar(err.message || 'Login failed', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = {
      customer: { email: 'john@example.com', password: 'password123' },
      manager: { email: 'maria@reserveiq.com', password: 'manager123' },
      admin: { email: 'admin@reserveiq.com', password: 'admin123' }
    };
    setFormData(creds[role]);
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
      {/* Decorative blobs */}
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,119,6,0.2), transparent 70%)' }} />
      <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(146,64,14,0.15), transparent 70%)' }} />

      <Container maxWidth="sm" sx={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Paper elevation={8} sx={{ p: { xs: 3.5, md: 5 }, borderRadius: 4, backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.95)' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <Box sx={{
                  width: 72, height: 72, borderRadius: '50%', mb: 2,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto',
                  boxShadow: '0 10px 30px rgba(217,119,6,0.4)'
                }}>
                  <Restaurant sx={{ fontSize: 36, color: 'white' }} />
                </Box>
              </motion.div>
              <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontFamily: '"Playfair Display", serif' }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your ReserveIQ account
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={!loading && <LoginIcon />}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.4,
                  fontSize: '1rem',
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(217,119,6,0.3)'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Demo accounts (click to fill)
              </Typography>
            </Divider>

            <Grid container spacing={1} sx={{ mb: 2 }}>
              {[
                { role: 'customer', label: 'Customer', color: '#059669' },
                { role: 'manager', label: 'Manager', color: '#0891b2' },
                { role: 'admin', label: 'Admin', color: '#dc2626' }
              ].map((d) => (
                <Grid item xs={4} key={d.role}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="medium"
                    onClick={() => fillDemo(d.role)}
                    sx={{
                      borderColor: `${d.color}40`,
                      color: d.color,
                      fontWeight: 600,
                      '&:hover': { borderColor: d.color, backgroundColor: `${d.color}0f` }
                    }}
                  >
                    {d.label}
                  </Button>
                </Grid>
              ))}
            </Grid>

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Don't have an account?{' '}
              <RouterLink to="/register" style={{ color: '#d97706', fontWeight: 700, textDecoration: 'none' }}>
                Sign up here →
              </RouterLink>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
