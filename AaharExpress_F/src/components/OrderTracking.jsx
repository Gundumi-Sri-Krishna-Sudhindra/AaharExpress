import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderTracking.css';

const OrderTracking = ({ order, onBackToHome }) => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState(order ? order.status : 'processing');
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [driverLocation, setDriverLocation] = useState({
    lat: 40.7128,
    lng: -74.006
  });
  
  // Rating popup state
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  
  // Simulation of order progress
  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }
    
    // Initialize status based on order
    setCurrentStatus(order.status);
    
    // Calculate initial progress
    const orderTime = new Date(order.timestamp).getTime();
    const estimatedDelivery = new Date(order.estimatedDelivery).getTime();
    const totalTime = estimatedDelivery - orderTime;
    const elapsed = Date.now() - orderTime;
    const initialProgress = Math.min(Math.floor((elapsed / totalTime) * 100), 100);
    setProgress(initialProgress);
    
    // Update remaining time
    updateRemainingTime(estimatedDelivery);
    
    // Simulate order progress
    const statusSequence = [
      { status: 'processing', progress: 0 },
      { status: 'confirmed', progress: 20 },
      { status: 'preparing', progress: 40 },
      { status: 'readyForPickup', progress: 60 },
      { status: 'outForDelivery', progress: 80 },
      { status: 'delivered', progress: 100 }
    ];
    
    // Find current status index
    const currentStatusIndex = statusSequence.findIndex(s => s.status === currentStatus);
    
    // Set up timers for status changes if not delivered yet
    if (currentStatus !== 'delivered' && currentStatusIndex < statusSequence.length - 1) {
      // Determine remaining stages
      const remainingStages = statusSequence.slice(currentStatusIndex + 1);
      
      // Create timers for each remaining stage
      remainingStages.forEach((stage, index) => {
        const delay = (index + 1) * 10000; // Increase delay for each subsequent stage (demo purposes)
        
        setTimeout(() => {
          setCurrentStatus(stage.status);
          setProgress(stage.progress);
          
          // Simulate driver movement for out for delivery stage
          if (stage.status === 'outForDelivery') {
            startDriverSimulation();
          }
        }, delay);
      });
    }
    
    // Set up timer to update remaining time
    const timeInterval = setInterval(() => {
      updateRemainingTime(estimatedDelivery);
    }, 60000);
    
    return () => {
      clearInterval(timeInterval);
    };
  }, [order, navigate]);
  
  const updateRemainingTime = (estimatedDelivery) => {
    if (!estimatedDelivery) return;
    
    const now = Date.now();
    const remaining = estimatedDelivery - now;
    
    if (remaining <= 0) {
      setRemainingTime("Arrived");
    } else {
      const minutes = Math.floor(remaining / 60000);
      setRemainingTime(`${minutes} min`);
    }
  };
  
  // Simulate driver movement
  const startDriverSimulation = () => {
    // Random movement toward destination
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        lat: prev.lat + (Math.random() * 0.001),
        lng: prev.lng + (Math.random() * 0.001)
      }));
    }, 5000);
    
    // Clear after some time
    setTimeout(() => {
      clearInterval(interval);
    }, 30000);
  };
  
  // Function to handle rating button click
  const handleRateExperience = () => {
    setShowRatingPopup(true);
  };
  
  // Function to close rating popup
  const closeRatingPopup = () => {
    setShowRatingPopup(false);
    
    // Reset rating form if it wasn't submitted
    if (!ratingSubmitted) {
      setRating(0);
      setFeedback('');
    }
  };
  
  // Function to handle star rating selection
  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };
  
  // Function to handle feedback input
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };
  
  // Function to submit rating
  const submitRating = () => {
    // Here you would typically send the rating data to your backend
    console.log('Rating submitted:', {
      orderId: order.id,
      rating,
      feedback
    });
    
    // Show success message
    setRatingSubmitted(true);
    
    // Close popup after delay
    setTimeout(() => {
      setShowRatingPopup(false);
      // Reset for next time
      setRating(0);
      setFeedback('');
      setRatingSubmitted(false);
    }, 2000);
  };
  
  if (!order) {
    return (
      <div className="order-tracking-page">
        <div className="container">
          <div className="no-order-message">
            <h2>No active order found</h2>
            <p>Please place an order to track its status</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'Processing Order';
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Preparing Your Food';
      case 'readyForPickup':
        return 'Ready for Pickup';
      case 'outForDelivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Processing Order';
    }
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Calculate price breakdown if not already provided
  const calculatePriceBreakdown = () => {
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = order.deliveryFee !== undefined ? order.deliveryFee : (subtotal > 30 ? 0 : 4.99);
    
    // If tax is provided, use it; otherwise calculate it as a8% of subtotal
    const tax = order.tax !== undefined ? order.tax : (subtotal * 0.08);
    
    return {
      subtotal,
      deliveryFee,
      tax,
      total: subtotal + deliveryFee + tax
    };
  };
  
  const priceBreakdown = calculatePriceBreakdown();
  
  return (
    <div className="order-tracking-page">
      <div className="container">
        <div className="order-tracking-card">
          <div className="order-tracking-header">
            <h1 className="tracking-title">Track Your Order</h1>
            <div className="order-meta">
              <div className="order-number">
                <span>Order ID:</span> {order.id}
              </div>
              <div className="order-time">
                <span>Ordered at:</span> {formatTime(order.timestamp)}
              </div>
            </div>
          </div>
          
          <div className="delivery-info">
            <div className="delivery-status">
              <h3 className="status-text">{getStatusText(currentStatus)}</h3>
              {remainingTime && (
                <div className="eta">
                  <i className="fa fa-clock-o"></i>
                  <span>
                    {currentStatus === 'delivered' 
                      ? 'Delivered!' 
                      : `Estimated arrival in ${remainingTime}`}
                  </span>
                </div>
              )}
            </div>
            
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-steps">
                <div className={`step ${progress >= 0 ? 'active' : ''}`}>
                  <div className="step-icon">
                    <i className="fa fa-check-circle"></i>
                  </div>
                  <span>Confirmed</span>
                </div>
                <div className={`step ${progress >= 40 ? 'active' : ''}`}>
                  <div className="step-icon">
                    <i className="fa fa-utensils"></i>
                  </div>
                  <span>Preparing</span>
                </div>
                <div className={`step ${progress >= 80 ? 'active' : ''}`}>
                  <div className="step-icon">
                    <i className="fa fa-truck"></i>
                  </div>
                  <span>On the way</span>
                </div>
                <div className={`step ${progress >= 100 ? 'active' : ''}`}>
                  <div className="step-icon">
                    <i className="fa fa-home"></i>
                  </div>
                  <span>Delivered</span>
                </div>
              </div>
            </div>
            
            {/* Simple Map Placeholder */}
            <div className="delivery-map">
              <div className="map-placeholder">
                <h3>Delivery Driver's Location</h3>
                <div className="map-content">
                  {currentStatus === 'outForDelivery' || currentStatus === 'delivered' ? (
                    <>
                      <div className="driver-marker">
                        <i className="fa fa-motorcycle"></i>
                      </div>
                      <div className="destination-marker">
                        <i className="fa fa-map-marker"></i>
                      </div>
                      <div className="map-coords">
                        <p>Driver at: {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}</p>
                      </div>
                    </>
                  ) : (
                    <p>Driver location will appear when your order is out for delivery</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-details">
            <h3 className="section-heading">Order Details</h3>
            <div className="order-items-list">
              {order.items.map(item => (
                <div className="order-item" key={item.id}>
                  <div className="item-details">
                    <span className="item-quantity">{item.quantity}x</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                  <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>₹{priceBreakdown.subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Fee:</span>
                <span>₹{priceBreakdown.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Tax (8%):</span>
                <span>₹{priceBreakdown.tax.toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span>₹{priceBreakdown.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="delivery-address">
              <h3 className="section-heading">Delivery Address</h3>
              <p>{order.shippingDetails.fullName}</p>
              <p>{order.shippingDetails.address}</p>
              <p>{order.shippingDetails.city}, {order.shippingDetails.zipCode}</p>
              <p>Phone: {order.shippingDetails.phone}</p>
            </div>
          </div>
          
          <div className="tracking-actions">
            <button className="btn btn-secondary" onClick={onBackToHome}>
              Back to Home
            </button>
            {currentStatus === 'delivered' && (
              <button className="btn btn-primary" onClick={handleRateExperience}>
                Rate Your Experience
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Rating Popup */}
      {showRatingPopup && (
        <div className="rating-popup-overlay">
          <div className="rating-popup">
            <button className="close-btn" onClick={closeRatingPopup}>×</button>
            
            {!ratingSubmitted ? (
              <>
                <h2>Rate Your Experience</h2>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`star ${rating >= star ? 'active' : ''}`}
                      onClick={() => handleStarClick(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                <div className="feedback-form">
                  <label htmlFor="feedback">Share your feedback (optional):</label>
                  <textarea 
                    id="feedback" 
                    value={feedback}
                    onChange={handleFeedbackChange}
                    placeholder="Tell us about your experience..."
                    rows="4"
                  ></textarea>
                </div>
                
                <button 
                  className="btn btn-primary submit-rating" 
                  onClick={submitRating}
                  disabled={rating === 0}
                >
                  Submit Rating
                </button>
              </>
            ) : (
              <div className="rating-success">
                <div className="success-icon">✓</div>
                <h3>Thank You!</h3>
                <p>Your feedback has been submitted successfully.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;