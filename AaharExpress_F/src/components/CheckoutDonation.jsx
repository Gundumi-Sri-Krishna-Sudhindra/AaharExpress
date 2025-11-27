import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { donationSchema } from '../utils/validationSchemas';
import './CheckoutDonation.css';

const QUICK_AMOUNTS = [100, 500, 1000, 2000];

const CheckoutDonation = ({ onDonationComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationStatus, setDonationStatus] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setIsSubmitting(true);
    setDonationStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, this would be an API call to process the donation
      console.log('Processing donation:', values);
      
      setDonationStatus({
        type: 'success',
        message: 'Thank you for your donation! Your contribution will help provide meals to those in need.'
      });

      if (onDonationComplete) {
        onDonationComplete(values);
      }
    } catch (error) {
      setDonationStatus({
        type: 'error',
        message: 'There was an error processing your donation. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-donation">
      <div className="donation-header">
        <h3>Make a Difference</h3>
        <p>Add a donation to your order to help provide meals to those in need</p>
      </div>

      <Formik
        initialValues={{
          amount: '',
          message: '',
          isAnonymous: false
        }}
        validationSchema={donationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting: formSubmitting }) => (
          <Form className="donation-form">
            <div className="donation-options">
              <div className="quick-amounts">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`amount-button ${values.amount === amount.toString() ? 'selected' : ''}`}
                    onClick={() => setFieldValue('amount', amount.toString())}
                    disabled={isSubmitting}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>

              <div className="custom-amount">
                <Field
                  type="number"
                  name="amount"
                  placeholder="Custom amount"
                  className="amount-input"
                  disabled={isSubmitting}
                />
                <ErrorMessage name="amount" component="div" className="error-message" />
                {values.amount > 0 && (
                  <div className="amount-preview">
                    Amount: {formatCurrency(values.amount)}
                  </div>
                )}
              </div>
            </div>

            <div className="donation-message">
              <Field
                as="textarea"
                name="message"
                placeholder="Add a message (optional)"
                className="message-input"
                maxLength="200"
                disabled={isSubmitting}
              />
              <ErrorMessage name="message" component="div" className="error-message" />
              {values.message && (
                <div className="character-count">
                  {200 - values.message.length} characters remaining
                </div>
              )}
            </div>

            <div className="donation-options">
              <label className="checkbox-label">
                <Field 
                  type="checkbox" 
                  name="isAnonymous"
                  disabled={isSubmitting}
                />
                Make this donation anonymous
              </label>
            </div>

            {donationStatus && (
              <div className={`donation-status ${donationStatus.type}`}>
                {donationStatus.message}
              </div>
            )}

            <button
              type="submit"
              className={`donate-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting || formSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Add Donation'}
            </button>

            <div className="donation-note">
              <p>100% of your donation goes directly to providing meals to those in need.</p>
              {values.amount > 0 && (
                <p className="impact-note">
                  Your donation of {formatCurrency(values.amount)} can help provide {Math.floor(values.amount / 30)} meals
                </p>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CheckoutDonation; 