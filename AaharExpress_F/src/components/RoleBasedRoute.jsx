import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * Role-based route protection component
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children The components to render if authorized
 * @param {string|string[]} props.roles Required roles to access this route (optional)
 * @param {string} props.redirectTo Path to redirect if unauthorized (defaults to /)
 * @returns {React.ReactNode} Protected component or redirect
 */
const RoleBasedRoute = ({ children, roles, redirectTo = '/' }) => {
  console.log('RoleBasedRoute check');
  
  // First check if user is authenticated at all
  const isAuthenticated = authService.isAuthenticated();
  console.log('RoleBasedRoute - isAuthenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('RoleBasedRoute - not authenticated, redirecting to', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  // If no roles are specified, just check authentication
  if (!roles) {
    console.log('RoleBasedRoute - no roles required, rendering children');
    return children;
  }
  
  // Convert single role to array for uniform handling
  const requiredRoles = Array.isArray(roles) ? roles : [roles];
  console.log('RoleBasedRoute - required roles:', requiredRoles);
  
  // Check if user has any of the required roles
  const hasRequiredRole = requiredRoles.some(role => authService.hasRole(role));
  
  if (!hasRequiredRole) {
    console.log('RoleBasedRoute - missing required role, redirecting to', redirectTo);
    
    // Could add a custom unauthorized page later instead of just redirecting
    return <Navigate to={redirectTo} replace />;
  }
  
  console.log('RoleBasedRoute - user has required role, rendering children');
  return children;
};

export default RoleBasedRoute; 