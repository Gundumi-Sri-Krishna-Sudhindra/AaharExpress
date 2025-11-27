import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Popup from './Popup';
import SignupPopup from './SignupPopup';

const Navbar = ({ 
  onOrderClick, 
  onContactClick, 
  cartItemCount = 0, 
  favoriteCount = 0, 
  onCartClick, 
  user,
  onLogout,
  darkMode
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const userMenuRef = useRef(null);
  const userProfileRef = useRef(null);

  // Debug log to check if user data is being received
  useEffect(() => {
    console.log("Navbar received user:", user);
    
    // Add a class to the body when user is authenticated
    if (user) {
      document.body.classList.add('user-authenticated');
    } else {
      document.body.classList.remove('user-authenticated');
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (userProfileRef.current && !userProfileRef.current.contains(event.target)) {
        setIsUserProfileOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOrderClick = () => {
    if (onOrderClick) {
      onOrderClick();
    } else {
      setIsPopupOpen(true);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleUserProfile = () => {
    setIsUserProfileOpen(!isUserProfileOpen);
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    setIsPopupOpen(true);
    setIsUserMenuOpen(false); // Close the user menu
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    setIsSignupPopupOpen(true);
    setIsUserMenuOpen(false); // Close the user menu
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    console.log("Logout clicked");
    if (onLogout) {
      onLogout();
    }
  };

  // Format user's roles for display
  const formatRoles = (roles) => {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return 'User';
    }
    
    return roles.map(role => {
      // Remove ROLE_ prefix and capitalize
      const roleName = role.replace('ROLE_', '').toLowerCase();
      return roleName.charAt(0).toUpperCase() + roleName.slice(1);
    }).join(', ');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${darkMode ? 'dark-mode' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link to="/">
              <img src="/logo.webp" alt="AaharExpress" className="navbar-logo" />
            </Link>
            <h1 
              className="brand-name" 
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: darkMode ? '#ffffff' : '#000000',
                fontSize: '32px',
                fontWeight: 'normal',
                letterSpacing: '1px'
              }}
            >
              AaharExpress
            </h1>
          </div>

          <div className="navbar-menu">
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About Us</Link>
              <a href="#" className="nav-link" onClick={(e) => {
                e.preventDefault();
                if (onContactClick) onContactClick();
              }}>Contact</a>
              
              {/* Favorites Link with Heart Icon */}
              <Link to="/favorites" className="nav-link favorites-link">
                <span className="favorites-icon">❤️</span>
                {favoriteCount > 0 && (
                  <span className="favorites-count">{favoriteCount}</span>
                )}
              </Link>
              
              {/* Cart Icon */}
              <button 
                className="cart-button nav-link" 
                onClick={onCartClick}
                aria-label="Shopping Cart"
              >
                <span className="cart-icon">🛒</span>
                {cartItemCount > 0 && (
                  <span className="cart-count">{cartItemCount}</span>
                )}
              </button>

              {/* User Authentication Section */}
              {user ? (
                /* Logged in user section */
                <div className="user-section" ref={userProfileRef}>
                  <button 
                    onClick={toggleUserProfile} 
                    className="nav-link user-greeting"
                    aria-label="User Profile"
                    aria-expanded={isUserProfileOpen}
                  >
                    <span className="user-avatar">👤</span>
                    <span className="user-greeting-text">{user.fullName || user.username || user.name || 'User'}</span>
                  </button>
                  
                  {isUserProfileOpen && (
                    <div className="user-profile-dropdown">
                      <div className="user-profile-header">
                        <span className="user-profile-avatar">👤</span>
                        <div className="user-profile-info">
                          <h3 className="user-profile-name">{user.fullName || user.username || user.name || 'User'}</h3>
                          {user.email && <p className="user-profile-email">{user.email}</p>}
                        </div>
                      </div>
                      
                      <div className="user-profile-details">
                        {user.roles && (
                          <div className="user-profile-item">
                            <span className="user-profile-label">Role:</span>
                            <span className="user-profile-value">{formatRoles(user.roles)}</span>
                          </div>
                        )}
                        
                        {user.lastLogin && (
                          <div className="user-profile-item">
                            <span className="user-profile-label">Last Login:</span>
                            <span className="user-profile-value">{new Date(user.lastLogin).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="user-profile-actions">
                        <Link to="/dashboard" className="user-profile-action">
                          <span className="action-icon">📊</span>
                          Dashboard
                        </Link>
                        <Link to="/account-settings" className="user-profile-action">
                          <span className="action-icon">⚙️</span>
                          Settings
                        </Link>
                        <button 
                          onClick={handleLogoutClick} 
                          className="user-profile-action logout-action"
                        >
                          <span className="action-icon">🚪</span>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleLogoutClick} 
                    className="logout-button"
                    aria-label="Logout"
                  >
                    <span className="logout-icon">🚪</span>
                    <span className="logout-text">Logout</span>
                  </button>
                </div>
              ) : (
                /* Guest user section */
                <div className="user-menu-container" ref={userMenuRef}>
                  <button 
                    className="user-icon-button" 
                    onClick={toggleUserMenu} 
                    aria-label="User Menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <span className="user-icon">👤</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="user-dropdown-menu">
                      <a href="#" className="dropdown-item" onClick={handleSignInClick}>
                        <span className="dropdown-icon">🔑</span>
                        Sign In
                      </a>
                      <a href="#" className="dropdown-item" onClick={handleSignupClick}>
                        <span className="dropdown-icon">📝</span>
                        Create Account
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      <SignupPopup isOpen={isSignupPopupOpen} onClose={() => setIsSignupPopupOpen(false)} />
    </nav>
  );
};

export default Navbar;