import React, { useState, useEffect } from 'react';
import './PartnerRegistration.css';

const PartnerRegistration = ({ onClose }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    address: '',
    city: '',
    description: '',
    agreedToTerms: false
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [applicationNumber, setApplicationNumber] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate random application number when form is submitted successfully
  useEffect(() => {
    if (success && !applicationNumber) {
      // Generate random application number: AE-YEAR-RANDOM
      const year = new Date().getFullYear();
      const random = Math.floor(10000 + Math.random() * 90000);
      setApplicationNumber(`AE-${year}-${random}`);
    }
  }, [success, applicationNumber]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateStep = (currentStep) => {
    let stepErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.businessName.trim()) {
        stepErrors.businessName = 'Business name is required';
        isValid = false;
      }
      if (!formData.contactName.trim()) {
        stepErrors.contactName = 'Contact name is required';
        isValid = false;
      }
      if (!formData.email.trim()) {
        stepErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        stepErrors.email = 'Email is invalid';
        isValid = false;
      }
      if (!formData.phone.trim()) {
        stepErrors.phone = 'Phone number is required';
        isValid = false;
      }
    } else if (currentStep === 2) {
      if (!formData.businessType) {
        stepErrors.businessType = 'Business type is required';
        isValid = false;
      }
      if (!formData.address.trim()) {
        stepErrors.address = 'Address is required';
        isValid = false;
      }
      if (!formData.city.trim()) {
        stepErrors.city = 'City is required';
        isValid = false;
      }
    } else if (currentStep === 3) {
      if (!formData.agreedToTerms) {
        stepErrors.agreedToTerms = 'You must agree to the terms';
        isValid = false;
      }
    }

    setErrors(stepErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  const copyApplicationNumber = () => {
    navigator.clipboard.writeText(applicationNumber)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="partner-registration-popup">
      <button className="popup-close-btn" onClick={onClose} aria-label="Close">✖</button>
      
      <div className="registration-header">
        <span className="header-emoji">🤝</span>
        <h1>Join AaharExpress as a Partner</h1>
        <p>Together, we can make a difference in food delivery and sustainability</p>
      </div>

      {success ? (
       <div style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        maxWidth: '600px',
        margin: 'auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '16px', fontSize: '36px' }}>
          <span>✅</span>
        </div>
        
        <h2 style={{ 
          margin: '0 0 20px 0', 
          color: '#000000', 
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          Application Submitted!
        </h2>
        
        <div style={{ textAlign: 'left' }}>
          <div style={{
            backgroundColor: '#e9ecef',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ fontWeight: 'bold', marginRight: '8px' }}>
              Your application number:
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>{applicationNumber}</span>
              <button 
                onClick={copyApplicationNumber}
                aria-label="Copy application number"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '8px',
                  fontSize: '16px',
                  color: '#6c757d'
                }}
              >
                {copySuccess ? '✓' : '📋'}
              </button>
            </div>
          </div>
          
          <p style={{ 
            marginTop: '16px', 
            lineHeight: '1.5',
            color: '#495057'
          }}>
            Thank you for your interest in partnering with AaharExpress. Our team will review your application and contact you within 2-3 business days.
          </p>
          
         
        </div>
      </div>
      
      ) : (
        <div className="registration-form-container">
          <div className="progress-indicator">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Basic Info</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Business Details</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Confirmation</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-step">
                <h2>Tell us about you</h2>
                
                <div className="form-group">
                  <label htmlFor="businessName">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    placeholder="Your restaurant or business name"
                    className={errors.businessName ? 'input-error' : ''}
                  />
                  {errors.businessName && <div className="error-message">{errors.businessName}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactName">Contact Person</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className={errors.contactName ? 'input-error' : ''}
                  />
                  {errors.contactName && <div className="error-message">{errors.contactName}</div>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                      className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Your contact number"
                      className={errors.phone ? 'input-error' : ''}
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="next-btn" onClick={nextStep}>
                    Next Step
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="form-step">
                <h2>Business Details</h2>
                
                <div className="form-group">
                  <label htmlFor="businessType">Business Type</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                    className={errors.businessType ? 'input-error' : ''}
                  >
                    <option value="">Select business type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="cloud_kitchen">Cloud Kitchen</option>
                    <option value="catering">Catering Service</option>
                    <option value="food_truck">Food Truck</option>
                    <option value="bakery">Bakery</option>
                    <option value="other">Other Food Service</option>
                  </select>
                  {errors.businessType && <div className="error-message">{errors.businessType}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Business Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Street address"
                    className={errors.address ? 'input-error' : ''}
                  />
                  {errors.address && <div className="error-message">{errors.address}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className={errors.city ? 'input-error' : ''}
                  />
                  {errors.city && <div className="error-message">{errors.city}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Tell us about your business</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="What type of food do you serve? What makes your business special?"
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="back-btn" onClick={prevStep}>
                    Back
                  </button>
                  <button type="button" className="next-btn" onClick={nextStep}>
                    Next Step
                  </button>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="form-step">
                <h2>Confirm Partnership</h2>
                
                <div className="partnership-benefits">
                  <h3>As an AaharExpress partner, you'll get:</h3>
                  <ul>
                    <li><span className="benefit-emoji">💰</span> New revenue streams through our delivery platform</li>
                    <li><span className="benefit-emoji">📊</span> Analytics dashboard to track your performance</li>
                    <li><span className="benefit-emoji">📱</span> Dedicated partner app for order management</li>
                    <li><span className="benefit-emoji">🌱</span> Opportunity to contribute to food donation initiatives</li>
                    <li><span className="benefit-emoji">📣</span> Marketing exposure to our growing customer base</li>
                  </ul>
                </div>
                
                <div className={`terms-agreement ${errors.agreedToTerms ? 'terms-error' : ''}`}>
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="agreedToTerms">
                    I agree to AaharExpress's <a href="/terms" className="terms-link">Terms & Conditions</a> and <a href="/privacy" className="terms-link">Privacy Policy</a>
                  </label>
                </div>
                {errors.agreedToTerms && <div className="error-message terms-error-message">{errors.agreedToTerms}</div>}
                
                <div className="form-actions">
                  <button type="button" className="back-btn" onClick={prevStep}>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default PartnerRegistration;