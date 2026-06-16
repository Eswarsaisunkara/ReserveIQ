/**
 * ReserveIQ - Authentication Context
 * ------------------------------------
 * Uses React Context API to manage user authentication state globally.
 * In a real Spring Boot backend, JWT tokens would be stored in localStorage
 * and sent with every Axios request via an interceptor.
 *
 * This context provides:
 * - currentUser: the logged-in user object (or null if not logged in)
 * - login(): simulates POST /api/auth/login
 * - register(): simulates POST /api/auth/register
 * - logout(): clears user session
 * - hasRole(): checks if current user has a specific role
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockData.js';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the AuthContext easily in any component
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps our app
export const AuthProvider = ({ children }) => {
  // State to hold the currently logged-in user
  // On page refresh, we check localStorage for saved user data
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('reserveiq_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('reserveiq_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('reserveiq_user');
    }
  }, [currentUser]);

  /**
   * Simulate user login
   * POST /api/auth/login
   * @param {string} email
   * @param {string} password
   * @returns {object} user object with JWT token
   */
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Find user with matching email and password
        const user = mockUsers.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
          // In real backend, server returns a JWT token.
          // We simulate a fake token here.
          const { password: _, ...userWithoutPassword } = user;
          const userWithToken = {
            ...userWithoutPassword,
            token: 'simulated-jwt-token-' + Math.random().toString(36).substring(7)
          };
          setCurrentUser(userWithToken);
          resolve(userWithToken);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 600);
    });
  };

  /**
   * Simulate user registration
   * POST /api/auth/register
   * @param {object} userData - { fullName, email, password }
   */
  const register = (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists
        const exists = mockUsers.find(
          u => u.email.toLowerCase() === userData.email.toLowerCase()
        );

        if (exists) {
          reject(new Error('Email is already registered'));
          return;
        }

        // Create new user (in real app, password is BCrypt hashed by Spring)
        const newUser = {
          id: mockUsers.length + 1,
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password,
          role: 'CUSTOMER', // Default role for new registrations
          createdAt: new Date().toISOString(),
          phone: userData.phone || ''
        };

        mockUsers.push(newUser);

        // Auto-login after registration
        const { password: _, ...userWithoutPassword } = newUser;
        const userWithToken = {
          ...userWithoutPassword,
          token: 'simulated-jwt-token-' + Math.random().toString(36).substring(7)
        };
        setCurrentUser(userWithToken);
        resolve(userWithToken);
      }, 600);
    });
  };

  /**
   * Logout - clear current user and localStorage
   * In real app, we could also blacklist the JWT token server-side
   */
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('reserveiq_user');
  };

  /**
   * Update user profile
   * @param {object} updates - fields to update
   */
  const updateProfile = (updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(prev => {
          const updated = { ...prev, ...updates };
          return updated;
        });
        resolve({ success: true });
      }, 400);
    });
  };

  /**
   * Check if current user has a specific role
   * @param {string|string[]} roles - role or array of roles
   * @returns {boolean}
   */
  const hasRole = (roles) => {
    if (!currentUser) return false;
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    return currentUser.role === roles;
  };

  // Values provided to the entire app
  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
