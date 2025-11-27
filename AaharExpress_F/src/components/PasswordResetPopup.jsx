import React, { useState } from 'react';
import logo from '/logo.webp';
import './Popup.css';

const PasswordResetPopup = ({ isOpen, onClose, onBackToSignIn, onSubmit }) => {
  const [email, setEmail] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    if (onSubmit) {
      onSubmit(email);
    } else {
      console.log("Password reset requested for:", email);
    }
    // You could show a success message or close the popup after API call
  };
  
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="popup-header">
          <img src={logo} alt="Logo" className="popup-logo" />
          <h2 className="popup-title">Reset Password</h2>
        </div>
        
        <p className="popup-subtitle" style={{ color: '#333333' }}>Enter your email to receive a password reset link</p>
        
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            {/* Label has been removed */}
            <input
              type="email"
              id="email"
              className="input-large"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email Address"
              required
            />
          </div>
          
          <button type="submit" className="signin-button">
            Send Reset Link
          </button>
          
          <button 
            type="button"
            className="signup-suggestion"
            style={{ 
              display: 'block', 
              width: '100%',
              marginTop: '1rem',
              padding: '0.75rem',
              color: 'black' // Changed to black for "Back to" text
            }}
            onClick={onBackToSignIn}
          >
            Back to <span style={{ color: '#ea580c' }}>Sign In!</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPopup;