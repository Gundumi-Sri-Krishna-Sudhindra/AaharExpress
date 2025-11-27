import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import userService from '../services/userService';
import authService from '../services/authService';
import AdminDashboard from './AdminDashboard';
import RestaurantDashboard from './RestaurantDashboard';
import CustomerDashboard from './CustomerDashboard';
import DeliveryAgentDashboard from './DeliveryAgentDashboard';

const Dashboard = ({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser || null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Dashboard mounted, fetching user data');
        setLoading(true);
        setError(null);
        
        // Add debug logging for localStorage
        try {
          const userData = localStorage.getItem('user');
          if (userData) {
            console.log('Dashboard - Current user data in localStorage:', JSON.parse(userData));
          } else {
            console.log('Dashboard - No user data in localStorage');
          }
        } catch (e) {
          console.error('Dashboard - Error parsing localStorage user data:', e);
        }
        
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          console.error('Not authenticated in Dashboard component');
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        console.log('Dashboard - authenticated, fetching user data');
        // Always try to get fresh user data from the server
        try {
          const userData = await userService.getCurrentUser();
          console.log('Dashboard - user data fetched successfully:', userData);
          
          // Ensure the user data has roles properly formatted
          const updatedUserData = {
            ...userData,
            roles: userData.roles || ['ROLE_CUSTOMER'] // Default to customer
          };
          
          // Ensure roles are properly formatted with ROLE_ prefix
          if (updatedUserData.roles) {
            updatedUserData.roles = updatedUserData.roles.map(role => {
              if (typeof role !== 'string') return 'ROLE_CUSTOMER';
              const upperRole = role.toUpperCase();
              if (!upperRole.startsWith('ROLE_')) return `ROLE_${upperRole}`;
              return upperRole;
            });
          }
          
          setUser(updatedUserData);
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          
          // Fetch user's orders if we have a user ID
          if (userData && userData.id) {
            try {
              console.log('Dashboard - fetching orders for user:', userData.id);
              const ordersData = await userService.getUserOrders(userData.id);
              console.log('Dashboard - orders fetched:', ordersData);
              setOrders(ordersData);
            } catch (orderError) {
              console.error('Error fetching orders:', orderError);
              // Continue with the user data we have
            }
          }
        } catch (userError) {
          console.error('Error fetching user data:', userError);
          
          // If server request fails, try to use cached user data
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            console.log('Dashboard - using cached user data');
            const parsedUser = JSON.parse(savedUser);
            
            // Ensure the user has roles properly formatted
            if (!parsedUser.roles || !Array.isArray(parsedUser.roles)) {
              parsedUser.roles = ['ROLE_CUSTOMER']; // Default to customer role
              localStorage.setItem('user', JSON.stringify(parsedUser));
            }
            
            setUser(parsedUser);
            setError('Could not refresh user data. Using cached data.');
          } else {
            console.error('Dashboard - no cached user data available');
            setError('Failed to load user data. Please try again later.');
          }
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('An error occurred while loading your dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Add a debug function
  const runApiChecks = async () => {
    setApiCheckResults('Running checks...');
    try {
      const results = await checkApiEndpoints();
      setApiCheckResults(JSON.stringify(results, null, 2));
    } catch (error) {
      setApiCheckResults(`Error running checks: ${error.message}`);
    }
  };
  
  // Debug auth state
  const checkAuthState = () => {
    const result = debugAuthState();
    setAuthDebugResult(JSON.stringify(result, null, 2));
  };
  
  // Fix auth roles
  const runAuthFix = () => {
    const wasFixed = fixAuthRoles();
    setAuthFixed(wasFixed);
    checkAuthState();
    
    // If we fixed something, reload the page to get the new roles
    if (wasFixed) {
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.href = '/'}>Return to Home</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-error">
        <h2>Not Logged In</h2>
        <p>Please log in to view your dashboard</p>
        <button onClick={() => window.location.href = '/'}>Return to Home</button>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  const renderRoleDashboard = () => {
    console.log('Dashboard - renderRoleDashboard - User data:', {
      username: user.username,
      id: user.id,
      roles: user.roles,
      normalizedRoles: user.roles ? user.roles.map(r => typeof r === 'string' ? r.toUpperCase() : r) : []
    });
    
    // Check if roles array exists
    if (!user.roles || !Array.isArray(user.roles)) {
      console.log('Dashboard - No roles found, defaulting to customer dashboard');
      return <CustomerDashboard user={user} />;
    }
    
    // Normalize roles to uppercase strings
    const normalizedRoles = user.roles.map(role => {
      if (typeof role !== 'string') return '';
      return role.toUpperCase();
    });
    
    console.log('Dashboard - Normalized roles:', normalizedRoles);
    
    // Check for admin role first
    if (normalizedRoles.some(role => role.includes('ADMIN'))) {
      console.log('Dashboard - Rendering Admin Dashboard');
      return <AdminDashboard user={user} />;
    }
    
    // Check for restaurant role
    if (normalizedRoles.some(role => role.includes('RESTAURANT'))) {
      console.log('Dashboard - Rendering Restaurant Dashboard');
      return <RestaurantDashboard user={user} />;
    }
    
    // Check for delivery agent role
    if (normalizedRoles.some(role => role.includes('DELIVERY') || role.includes('DELIVERY_AGENT'))) {
      console.log('Dashboard - Rendering Delivery Agent Dashboard');
      return <DeliveryAgentDashboard user={user} />;
    }
    
    // Default to customer dashboard
    console.log('Dashboard - Defaulting to Customer Dashboard');
    return <CustomerDashboard user={user} />;
  };

  return renderRoleDashboard();
};

export default Dashboard;
