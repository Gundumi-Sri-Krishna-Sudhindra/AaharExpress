import authService from '../services/authService';
import userService from '../services/userService';
import axios from 'axios';

// Simple utility to test authentication state and user data
const authTest = {
  // Check current authentication state
  checkAuthState: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.group('Auth State Check');
    console.log('Has token:', !!token);
    if (token) {
      console.log('Token (first 15 chars):', token.substring(0, 15) + '...');
    }
    
    console.log('Has user data:', !!user);
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('User data:', {
          username: userData.username,
          id: userData.id,
          email: userData.email
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    console.log('Auth service isAuthenticated():', authService.isAuthenticated());
    console.log('Axios default headers:', !!axios?.defaults?.headers?.common?.['Authorization']);
    console.groupEnd();
    
    return {
      hasToken: !!token,
      hasUser: !!user,
      isAuthenticated: authService.isAuthenticated()
    };
  },
  
  // Force authentication with test data
  forceAuth: (username = 'testuser') => {
    const testToken = 'test_token_' + Date.now();
    const testUser = {
      id: 1,
      username: username,
      email: `${username}@example.com`,
      name: 'Test User',
      roles: ['ROLE_USER']
    };
    
    // Clear any existing data first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Set new test data
    localStorage.setItem('token', testToken);
    localStorage.setItem('user', JSON.stringify(testUser));
    
    // Set default Authorization header for all future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${testToken}`;
    
    console.log('Forced authentication with test data:', {
      username,
      token: testToken.substring(0, 10) + '...',
      isAuthenticated: authService.isAuthenticated() // Verify it worked
    });
    
    return testUser;
  },
  
  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear axios headers
    if (typeof axios !== 'undefined' && axios.defaults && axios.defaults.headers.common) {
      delete axios.defaults.headers.common['Authorization'];
    }
    
    console.log('Cleared all authentication data');
  }
};

export default authTest; 