/**
 * ReserveIQ - Main Entry Point
 * -----------------------------
 * Bootstraps React with:
 * - BrowserRouter for routing
 * - AuthProvider for global auth state
 * - MUI ThemeProvider with custom restaurant theme
 * - SnackbarProvider for toast notifications
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

// Custom MUI theme with restaurant amber/copper palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#d97706',
      light: '#fbbf24',
      dark: '#92400e',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#1f2937',
      light: '#374151',
      dark: '#111827'
    },
    success: {
      main: '#059669'
    },
    warning: {
      main: '#f59e0b'
    },
    error: {
      main: '#dc2626'
    },
    background: {
      default: '#fafaf9',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 10
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          overflow: 'hidden'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small'
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8
        }
      }
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        style={{ borderRadius: 10, fontFamily: 'Inter' }}
      >
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>
);
