import React, { useState, useEffect } from 'react';
import authTest from '../utils/authTest';
import authService from '../services/authService';

const AuthDebugger = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState({});
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // Check auth state when component mounts or user changes
    checkAndUpdateState();
  }, [user]);
  
  const checkAndUpdateState = () => {
    const state = authTest.checkAuthState();
    setAuthState(state);
    
    // Try to get user data from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUserData(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user data in debugger:', error);
        setUserData(null);
      }
    } else {
      setUserData(null);
    }
  };
  
  const handleForceAuth = () => {
    const testUser = authTest.forceAuth();
    checkAndUpdateState();
    // Reload page to apply changes
    window.location.reload();
  };
  
  const handleClearAuth = () => {
    authTest.clearAuth();
    checkAndUpdateState();
    // Reload page to apply changes
    window.location.reload();
  };
  
  const handleFixAuth = () => {
    // Use the authService's fixAuthState method to fix common auth issues
    if (authService.fixAuthState()) {
      checkAndUpdateState();
      window.location.reload();
    } else {
      alert('Could not fix authentication state. Try Force Auth instead.');
    }
  };
  
  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '5px',
        fontSize: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '5px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        {isOpen ? 'Hide Auth Debug' : 'Auth Debug'}
      </button>
      
      {isOpen && (
        <div style={{ padding: '10px' }}>
          <div>
            <strong>Auth State:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li>Has Token: {authState.hasToken ? '✅' : '❌'}</li>
              <li>Has User: {authState.hasUser ? '✅' : '❌'}</li>
              <li>isAuthenticated: {authState.isAuthenticated ? '✅' : '❌'}</li>
              <li>Current User: {user ? user.username : 'None'}</li>
            </ul>
          </div>
          
          {userData && (
            <div>
              <strong>localStorage User Data:</strong>
              <pre style={{ 
                fontSize: '10px', 
                background: '#f8f8f8', 
                padding: '5px', 
                border: '1px solid #ddd',
                overflow: 'auto',
                maxHeight: '100px'
              }}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}
          
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={handleForceAuth}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                marginRight: '5px',
                cursor: 'pointer',
                borderRadius: '3px'
              }}
            >
              Force Auth
            </button>
            
            <button 
              onClick={handleClearAuth}
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                marginRight: '5px',
                cursor: 'pointer',
                borderRadius: '3px'
              }}
            >
              Clear Auth
            </button>
            
            <button 
              onClick={handleFixAuth}
              style={{
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '3px'
              }}
            >
              Fix Auth
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDebugger; 