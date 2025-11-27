import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { donationSchema } from '../utils/validationSchemas';
import './DonationForm.css';

const MAX_DONATION_AMOUNT = 1000000; // 10 Lakh INR

const DonationForm = ({ onClose, onSuccess }) => {
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      if (values.amount > MAX_DONATION_AMOUNT) {
        throw new Error(`Maximum donation amount is ₹${MAX_DONATION_AMOUNT.toLocaleString()}`);
      }

      // Here you would typically make an API call to your backend
      console.log('Donation values:', values);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess(values);
      onClose();
    } catch (error) {
      setStatus({ error: error.message || 'Failed to process donation. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="donation-form-container">
      <div className="donation-form-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="donation-header">
          <h2>Make a Donation</h2>
          <p>Help us provide meals to those in need</p>
        </div>

        <Formik
          initialValues={{
            amount: '',
            message: '',
            anonymous: false
          }}
          validationSchema={donationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status, values }) => (
            <Form className="donation-form">
              {status?.error && (
                <div className="error-message">
                  {status.error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="amount">Donation Amount (₹)</label>
                <Field
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="Enter amount"
                  min="1"
                  max={MAX_DONATION_AMOUNT}
                />
                <ErrorMessage name="amount" component="div" className="error-text" />
                {values.amount > 0 && (
                  <div className="amount-preview">
                    Amount: ₹{Number(values.amount).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message (Optional)</label>
                <Field
                  as="textarea"
                  id="message"
                  name="message"
                  placeholder="Share why you're donating..."
                  rows="3"
                  maxLength="200"
                />
                <ErrorMessage name="message" component="div" className="error-text" />
                {values.message && (
                  <div className="character-count">
                    {200 - values.message.length} characters remaining
                  </div>
                )}
              </div>

              <div className="form-group checkbox-group">
                <Field
                  type="checkbox"
                  id="anonymous"
                  name="anonymous"
                />
                <label htmlFor="anonymous">Make this donation anonymous</label>
              </div>

              <div className="impact-preview">
                <h3>Your Impact</h3>
                <div className="impact-stats">
                  <div className="impact-stat">
                    <span className="stat-value">
                      {values.amount ? Math.floor(values.amount / 30) : 0}
                    </span>
                    <span className="stat-label">Meals Provided</span>
                  </div>
                  <div className="impact-stat">
                    <span className="stat-value">
                      {values.amount ? Math.floor(values.amount / 30) : 0}
                    </span>
                    <span className="stat-label">People Helped</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="donate-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Donate Now'}
              </button>

              <div className="donation-note">
                <p>100% of your donation goes directly to providing meals to those in need.</p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DonationForm; 