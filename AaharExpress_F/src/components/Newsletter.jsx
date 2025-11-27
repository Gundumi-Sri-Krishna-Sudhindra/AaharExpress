import React, { useState } from 'react';
import './Newsletter.css';
import logo1 from '../assets/logo1.webp';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setError('');
    }, 500);
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
            <p className="newsletter-description">
              Stay updated with our latest offers, new menu items, and exclusive promotions.
              Get a 10% discount on your first order when you subscribe!
            </p>
            
            {!subscribed ? (
              <form className="newsletter-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className={`newsletter-input ${error ? 'error' : ''}`}
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    required
                  />
                  <button type="submit" className="newsletter-button">Subscribe</button>
                </div>
                {error && <p className="error-message">{error}</p>}
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <p>Thank you for subscribing! Check your email for your 10% discount code.</p>
              </div>
            )}
          </div>
          
          <div className="newsletter-image">
            <img src={logo1} alt="Newsletter" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
