import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logo from '/logo.webp';
import './Popup.css';
import emailjs from '@emailjs/browser';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

// Generate a random temporary password
const generateTemporaryPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const ForgotPassword = ({ isOpen, onClose, onBackToSignIn }) => {
  const [requestStatus, setRequestStatus] = useState({ 
    message: '', 
    type: '' // 'success' or 'error'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      setRequestStatus({ message: '', type: '' });
      
      // Generate a temporary password
      const temporaryPassword = generateTemporaryPassword();
      
      // Send email using EmailJS
      const emailParams = {
        to_email: values.email,
        to_name: values.email.split('@')[0],
        temp_password: temporaryPassword,
        message: `Your temporary password for AaharExpress is: ${temporaryPassword}. Please use this to login and then change your password.`
      };
      
      // Replace these with your actual EmailJS credentials
      const serviceID = 'service_xxxxxxx'; // Replace with your EmailJS service ID
      const templateID = 'template_xxxxxxx'; // Replace with your EmailJS template ID
      const publicKey = 'xxxxxxxxxxxxxxxxxxxx'; // Replace with your EmailJS public key
      
      const response = await emailjs.send(serviceID, templateID, emailParams, publicKey);
      
      console.log('Email sent successfully:', response);
      
      // Show success message
      setRequestStatus({ 
        message: 'A temporary password has been sent to your email address.', 
        type: 'success' 
      });
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Failed to send email:', error);
      setRequestStatus({ 
        message: 'Failed to send email. Please try again later.', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="popup-header">
          <img src={logo} alt="Logo" className="popup-logo" />
          <h2 className="popup-title">Forgot Password</h2>
        </div>
        
        <p className="popup-subtitle" style={{ color: '#333333' }}>
          Enter your email to receive a temporary password
        </p>
        
        <Formik
          initialValues={{ email: '' }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="popup-form">
              {requestStatus.message && (
                <div className={`${requestStatus.type === 'success' ? 'success-message' : 'error-message'}`}>
                  {requestStatus.message}
                </div>
              )}
              
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="input-large"
                  placeholder="Enter your Email Address"
                  disabled={isSubmitting || requestStatus.type === 'success'}
                />
                <ErrorMessage name="email" component="div" className="error-text" />
              </div>
              
              <button 
                type="submit" 
                className="signin-button"
                disabled={isSubmitting || requestStatus.type === 'success'}
              >
                {isSubmitting ? 'Processing...' : 'Send Temporary Password'}
              </button>
              
              <button 
                type="button"
                className="signup-suggestion"
                style={{ 
                  display: 'block', 
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.75rem',
                  color: 'black'
                }}
                onClick={onBackToSignIn}
                disabled={isSubmitting}
              >
                Back to <span style={{ color: '#ea580c' }}>Sign In!</span>
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword; 