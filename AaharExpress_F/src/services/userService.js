import axios from 'axios';
import authService from './authService';

const processEnv = typeof process !== 'undefined' ? process.env ?? {} : {};
const API_BASE_URL =
  import.meta.env?.VITE_API_URL ||
  'http://localhost:8080/api';

const extractRoleString = (roleInput) => {
  if (!roleInput) return null;
  
  if (typeof roleInput === 'string') {
    return roleInput.trim();
  }
  
  if (typeof roleInput === 'object') {
    const candidate = roleInput.name || roleInput.roleName || roleInput.authority || roleInput.value;
    return typeof candidate === 'string' ? candidate.trim() : null;
  }
  
  return null;
};

const normalizeRoles = (rolesData) => {
  if (!rolesData) return ['ROLE_CUSTOMER']; // Default role
  
  const roleArray = Array.isArray(rolesData) ? rolesData : [rolesData];
  const normalized = roleArray
    .map(role => {
      const extracted = extractRoleString(role);
      if (!extracted) return null;
      const upperRole = extracted.toUpperCase();
      return upperRole.startsWith('ROLE_') ? upperRole : `ROLE_${upperRole}`;
    })
    .filter((role, index, array) => role && array.indexOf(role) === index);
  
  return normalized.length ? normalized : ['ROLE_CUSTOMER'];
};

// Helper function to ensure user data has all required fields and properly formatted roles
const formatUserData = (userData) => {
  // Format roles properly
  const roles = normalizeRoles(userData.roles || userData.role);
  
  // Create a properly formatted user object
  return {
    ...userData,
    id: userData.id || 0,
    username: userData.username || '',
    email: userData.email || '',
    fullName: userData.fullName || userData.name || '',
    mobileNumber: userData.mobileNumber || userData.phone || '',
    address: userData.address || '',
    memberSince: userData.memberSince || userData.createdAt || new Date().toISOString(),
    roles: roles,
    // Add any other fields that might come from your backend
    restaurantName: userData.restaurantName || ''
  };
};

const userService = {
  // Fetch user details after successful login
  fetchUserAfterLogin: async (username) => {
    try {
      console.log('userService: Fetching user details after login for:', username);
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // First try to get user by username
      try {
        const response = await axios.get(`${API_BASE_URL}/users/username/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('userService: User details fetched successfully:', response.data);
        
        // Format user data
        const userData = formatUserData(response.data);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        return userData;
      } catch (usernameError) {
        console.error('userService: Error fetching by username:', usernameError);
        
        // Fallback to /users/me endpoint
        const meResponse = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('userService: User details fetched from /me endpoint:', meResponse.data);
        
        // Format user data
        const userData = formatUserData(meResponse.data);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        return userData;
      }
    } catch (error) {
      console.error('userService: Failed to fetch user details after login:', error.response?.data || error.message);
      throw error;
    }
  },

  // Verify token is valid
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Make a request to a protected endpoint to verify token
      const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      console.log('userService: getCurrentUser called');
      const token = authService.getToken();
      if (!token) {
        console.error('userService: No authentication token found');
        throw new Error('No authentication token found');
      }
      
      console.log('userService: Making request to /users/me');
      const response = await axios.get(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('userService: User data received:', response.data);
      
      // Format user data
      const userData = formatUserData(response.data);
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('userService: Error fetching current user:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get user by username
  getUserByUsername: async (username) => {
    try {
      console.log(`userService: getUserByUsername called for ${username}`);
      const token = authService.getToken();
      if (!token) {
        console.error('userService: No authentication token found');
        throw new Error('No authentication token found');
      }
      
      console.log(`userService: Making request to /users/username/${username}`);
      const response = await axios.get(`${API_BASE_URL}/users/username/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('userService: User data received:', response.data);
      
      // Format user data
      const userData = formatUserData(response.data);
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error(`userService: Error fetching user by username (${username}):`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get user orders
  getUserOrders: async (userId) => {
    try {
      console.log(`userService: getUserOrders called for user ${userId}`);
      const token = authService.getToken();
      if (!token) {
        console.error('userService: No authentication token found');
        throw new Error('No authentication token found');
      }
      
      console.log(`userService: Making request to /orders/user/${userId}`);
      const response = await axios.get(`${API_BASE_URL}/orders/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('userService: Orders received:', response.data);
      return response.data;
    } catch (error) {
      console.error(`userService: Error fetching orders for user (${userId}):`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: async (userId, userData) => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Ensure we're sending the proper field names that match the backend
      const updatedData = {
        ...userData,
        fullName: userData.name || userData.fullName, // Support both name and fullName
        mobileNumber: userData.phone || userData.mobileNumber, // Support both phone and mobileNumber
        // Keep address as is since it's the same field name
      };
      
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Ensure proper field mapping in the response
      const responseData = {
        ...response.data,
        fullName: response.data.fullName || response.data.name || '',
        mobileNumber: response.data.mobileNumber || response.data.phone || '',
        address: response.data.address || '',
        memberSince: response.data.memberSince || response.data.createdAt || new Date().toISOString()
      };
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(responseData));
      
      return responseData;
    } catch (error) {
      console.error(`Error updating user profile (${userId}):`, error);
      throw error;
    }
  },
  
  // Add new address
  addUserAddress: async (userId, addressData) => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await axios.post(`${API_BASE_URL}/users/${userId}/addresses`, addressData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding address for user (${userId}):`, error);
      throw error;
    }
  }
};

export default userService;