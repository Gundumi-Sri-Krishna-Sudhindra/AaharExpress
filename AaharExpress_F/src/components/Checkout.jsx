import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = ({ cartItems, onCheckout, onQuantityChange, onRemoveItem, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user ? user.fullName : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    address: user ? user.address : '',
    city: user ? user.city : '',
    zipCode: user ? user.zipCode : '',
    paymentMethod: 'creditCard',
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 30 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'zipCode'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Credit card validation if paying by card
    if (formData.paymentMethod === 'creditCard') {
      if (!formData.nameOnCard) {
        newErrors.nameOnCard = 'Please enter the name on card';
      }
      
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Please enter the card number';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\D/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Please enter the expiry date';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please use MM/YY format';
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'Please enter the CVV';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const shippingDetails = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      zipCode: formData.zipCode,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod
    };
    
    // Create order with all price components
    const order = {
      items: [...cartItems],
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      tax: tax,
      total: total,
      shippingDetails: shippingDetails,
      status: 'processing',
      timestamp: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(),
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };
    
    // Simulate payment processing
    setTimeout(() => {
      // Pass the complete order object to onCheckout
      onCheckout(order);
      navigate('/tracking');
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart-message">
            <h2>Your cart is empty</h2>
            <p>Add items to your cart before proceeding to checkout.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Back to Menu
            </button>
          </div>
        ) : (
          <div className="checkout-content">
            <div className="checkout-form-container">
              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <h2 className="form-section-title">Delivery Information</h2>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label" htmlFor="zipCode">ZIP Code</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                      {errors.zipCode && <div className="invalid-feedback">{errors.zipCode}</div>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="notes">Delivery Notes (Optional)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      className="form-control"
                      rows="3"
                      placeholder="Special instructions for delivery"
                      value={formData.notes}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                
                <div className="form-section">
                  <h2 className="form-section-title">Payment Method</h2>
                  
                  <div className="payment-options">
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="creditCard"
                        name="paymentMethod"
                        value="creditCard"
                        checked={formData.paymentMethod === 'creditCard'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="creditCard">Credit Card</label>
                    </div>
                    
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="paypal">PayPal</label>
                    </div>
                    
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="cashOnDelivery"
                        name="paymentMethod"
                        value="cashOnDelivery"
                        checked={formData.paymentMethod === 'cashOnDelivery'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="cashOnDelivery">Cash on Delivery</label>
                    </div>
                  </div>
                  
                  {formData.paymentMethod === 'creditCard' && (
                    <div className="credit-card-form">
                      <div className="form-group">
                        <label className="form-label" htmlFor="nameOnCard">Name on Card</label>
                        <input
                          type="text"
                          id="nameOnCard"
                          name="nameOnCard"
                          className={`form-control ${errors.nameOnCard ? 'is-invalid' : ''}`}
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                        />
                        {errors.nameOnCard && <div className="invalid-feedback">{errors.nameOnCard}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label" htmlFor="cardNumber">Card Number</label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="XXXX XXXX XXXX XXXX"
                        />
                        {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="expiryDate">Expiry Date</label>
                          <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                          />
                          {errors.expiryDate && <div className="invalid-feedback">{errors.expiryDate}</div>}
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label" htmlFor="cvv">CVV</label>
                          <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="XXX"
                          />
                          {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'paypal' && (
                    <div className="paypal-info">
                      <p>You will be redirected to PayPal to complete your payment after you place your order.</p>
                    </div>
                  )}
                  
                  {formData.paymentMethod === 'cashOnDelivery' && (
                    <div className="cod-info">
                      <p>Please have the exact amount ready at the time of delivery.</p>
                    </div>
                  )}
                </div>
                
                <div className="checkout-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="checkout-summary">
              <div className="checkout-summary-content">
                <h2 className="summary-title">Order Summary</h2>
                
                <div className="cart-items-list">
                  {cartItems.map(item => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-details">
                        <h3 className="cart-item-title">{item.name}</h3>
                        <div className="cart-item-price">₹{item.price.toFixed(2)} × {item.quantity}</div>
                      </div>
                      <div className="cart-item-total">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="cart-item-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="item-quantity">{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button 
                          className="remove-btn"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Tax (8%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                {deliveryFee > 0 && (
                  <div className="free-delivery-note">
                    Add ₹{(30 - subtotal).toFixed(2)} more to qualify for free delivery!
                  </div>
                )}
                
                <div className="estimated-delivery">
                  <i className="fa fa-clock-o"></i>
                  <span>Estimated delivery time: 30-45 minutes</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;