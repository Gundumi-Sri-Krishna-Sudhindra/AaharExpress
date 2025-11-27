import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// UserAccountPopup component - handles both logged in and logged out states
const UserAccountPopup = ({ user, onLogout, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  // Handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
      navigate('/');
    }
  };

  return (
    <div className="user-account-container">
      <button 
        className="nav-link account-link" 
        onClick={togglePopup}
        aria-label="User Account"
      >
        <span className="account-icon">👤</span>
        {user && <span className="user-name">{user.name}</span>}
      </button>
      
      {isOpen && (
        <div className="account-popup" ref={popupRef}>
          {user ? (
            // Logged in user view
            <div className="logged-in-menu">
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <div className="user-details">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              
              <div className="menu-options">
                <Link to="/profile" className="menu-item" onClick={() => setIsOpen(false)}>
                  <span className="menu-icon">✏️</span>
                  <span>Edit Profile</span>
                </Link>
                <Link to="/orders" className="menu-item" onClick={() => setIsOpen(false)}>
                  <span className="menu-icon">📋</span>
                  <span>Order History</span>
                </Link>
                <Link to="/addresses" className="menu-item" onClick={() => setIsOpen(false)}>
                  <span className="menu-icon">🏠</span>
                  <span>Saved Addresses</span>
                </Link>
                <Link to="/payment-methods" className="menu-item" onClick={() => setIsOpen(false)}>
                  <span className="menu-icon">💳</span>
                  <span>Payment Methods</span>
                </Link>
                <Link to="/favorites" className="menu-item" onClick={() => setIsOpen(false)}>
                  <span className="menu-icon">❤️</span>
                  <span>Favorites</span>
                </Link>
                <button onClick={handleLogout} className="logout-button menu-item">
                  <span className="menu-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            // Logged out user view
            <div className="logged-out-menu">
              <h3>Welcome to AaharExpress</h3>
              <p>Sign in to access your account</p>
              
              <div className="auth-buttons">
                <Link to="/login" className="auth-button login-button" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="auth-button register-button" onClick={() => setIsOpen(false)}>
                  Create Account
                </Link>
              </div>
              
              <div className="guest-options">
                <Link to="/track-order" className="menu-item" onClick={() => setIsOpen(false)}>
                  <span className="menu-icon">🔍</span>
                  <span>Track Order</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAccountPopup;