import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = ({ user }) => {
  // Debug log to check if user data is being received
  useEffect(() => {
    console.log("Hero component received user:", user);
  }, [user]);

  // Format user's roles for display
  const formatRoles = (roles) => {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return 'User';
    }
    
    return roles.map(role => {
      // Check if role is a string before using replace
      if (typeof role !== 'string') {
        return 'User';
      }
      
      // Remove ROLE_ prefix and capitalize
      const roleName = role.replace('ROLE_', '').toLowerCase();
      return roleName.charAt(0).toUpperCase() + roleName.slice(1);
    }).join(', ');
  };

  return (
    <section className="hero">
      <div className="hero-wrapper">
        <div className="hero-content">
          <div className="content-wrapper">
            {user ? (
              <div className="welcome-message">
                <h1 className="hero-title">
                  Welcome back, <span className="highlight">{user.fullName || user.username || user.name || 'User'}</span>!
                </h1>
                
                <div className="user-details">
                  {user.email && (
                    <p className="user-email">
                      <span className="detail-label">Email:</span> {user.email}
                    </p>
                  )}
                  
                  {user.roles && (
                    <p className="user-role">
                      <span className="detail-label">Role:</span> {formatRoles(user.roles)}
                    </p>
                  )}
                  
                  {user.lastLogin && (
                    <p className="user-last-login">
                      <span className="detail-label">Last Login:</span> {new Date(user.lastLogin).toLocaleString()}
                    </p>
                  )}
                </div>
                
                <p className="hero-description">
                  We're glad to see you again. Ready to explore our delicious offerings?
                </p>
              </div>
            ) : (
              <h1 className="hero-title">
                Delicious Food
                <span className="highlight"> Delivered</span> 
                <br />To Your Door
              </h1>
            )}
            
            {!user && (
              <p className="hero-description">
                Choose from a wide variety of cuisines and enjoy contactless delivery. 
                Fresh ingredients, amazing taste, delivered to you.
              </p>
            )}
            
            <div className="cta-buttons">
              <Link to="/menu">
                <button className="hero-btn">Explore Menu</button>
              </Link>
              {user && (
                <Link to="/account-settings">
                  <button className="hero-btn dashboard-btn">Account Settings</button>
                </Link>
              )}
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Restaurants</span>
                </div>
                <div className="stat-separator"></div>
                <div className="stat-item">
                  <span className="stat-number">25-40</span>
                  <span className="stat-label">Min Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-image-container">
          <div className="image-wrapper">
            <img src="/f.webp" alt="Delicious food spread" className="hero-image" />
            <div className="floating-card">
              <div className="card-icon" style={{ marginLeft: "+2.5rem" }}>🔥</div>
              <div className="card-text">
                <span className="card-title">Today's Hot Deals</span>
                <span className="card-subtitle">Up to 50% off</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;