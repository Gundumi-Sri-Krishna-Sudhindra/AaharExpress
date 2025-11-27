import React, { useState } from 'react'; // Import useState
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './Popup.css';
import logo from '/logo.webp';
import { signupSchema } from '../utils/validationSchemas';
import authService from '../services/authService';

const SignupPopup = ({isOpen, onClose, onSignInClick}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState("");
    const [signupError, setSignupError] = useState("");
    
    if(!isOpen) return null;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            // Clear any previous messages
            setSignupSuccess("");
            setSignupError("");
            
            // Format the role with ROLE_ prefix
            const role = values.role.toUpperCase();
            const formattedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
            
            // Create the API request payload that matches the backend SignupRequest structure
            const signupData = {
                username: values.username,
                email: values.email,
                password: values.password,
                role: [formattedRole] // Send properly formatted role
            };
    
            console.log('Sending signup data:', signupData);
    
            // Use shared auth service so base URL/env handling stays consistent
            const response = await authService.register(signupData);
            
            console.log('Signup successful:', response);
            
            // Show success message directly with useState
            setSignupSuccess('✅ Account created successfully! Redirecting to sign in page...');
            console.log('Success message set:', '✅ Account created successfully! Redirecting to sign in page...');
            
            // Reset form after successful submission
            resetForm();
            
            // Close popup after short delay
            setTimeout(() => {
                onClose();
                // Optionally open sign in popup
                if (onSignInClick) {
                    onSignInClick();
                }
            }, 3000);
        } catch (error) {
            console.error('Signup error:', error);
            
            // Handle different error responses
            if (error.response) {
                console.error('Server response error:', error.response);
                const errorMessage = error.response.data?.message || 'Failed to create account. Please try again.';
                setSignupError(errorMessage);
            } else if (error.request) {
                console.error('No response error:', error.request);
                setSignupError('No response from server. Please check your connection.');
            } else {
                console.error('Request setup error:', error.message);
                setSignupError('Error sending request. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content" style={{ 
                width: "500px", 
                maxWidth: "95vw", 
                padding: "24px",
                maxHeight: "95vh",
                overflow: "auto"
            }}>
                <button className="close-button" onClick={onClose}>×</button>
                
                <div className="popup-header" style={{ marginBottom: "10px" }}>
                    <img 
                        src={logo} 
                        alt="Company Logo" 
                        className="popup-logo" 
                        style={{ height: "110px", margin: "0 auto 10px", display: "block" }} 
                    />
                    <h2 className="popup-title" style={{ fontSize: "1.5rem", textAlign: "center", margin: "0" }}>Create Account</h2>
                </div>
        
                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        role: 'customer' // Default role set to customer
                    }}
                    validationSchema={signupSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="popup-form" style={{ gap: "8px" }}>
                            {signupError && (
                                <div className="error-message">
                                    {signupError}
                                </div>
                            )}
                            
                            {signupSuccess && (
                                <div className="success-message">
                                    {signupSuccess}
                                </div>
                            )}

                            <div className="form-group" style={{ marginBottom: "8px" }}>
                                <label htmlFor="username" className="form-label" style={{ fontSize: "1rem", marginBottom: "3px" }}>Username</label>
                                <Field
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Enter your username"
                                    style={{ padding: "8px 10px", fontSize: "1rem", width: "100%" }}
                                    disabled={!!signupSuccess}
                                />
                                <ErrorMessage name="username" component="div" className="error-text" style={{ color: 'red' }} />
                            </div>
                            
                            <div className="form-group" style={{ marginBottom: "8px" }}>
                                <label htmlFor="email" className="form-label" style={{ fontSize: "1rem", marginBottom: "3px" }}>Email</label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    style={{ padding: "8px 10px", fontSize: "1rem", width: "100%" }}
                                    disabled={!!signupSuccess}
                                />
                                <ErrorMessage name="email" component="div" className="error-text" style={{ color: 'red' }} />
                            </div>
                            
                            <div className="form-group" style={{ marginBottom: "8px" }}>
                                <label htmlFor="password" className="form-label" style={{ fontSize: "1rem", marginBottom: "3px" }}>Password</label>
                                <div className="password-input-container">
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        style={{ padding: "8px 10px", fontSize: "1rem", width: "100%" }}
                                        disabled={!!signupSuccess}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-button"
                                        onClick={togglePasswordVisibility}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        disabled={!!signupSuccess}
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                <ErrorMessage name="password" component="div" className="error-text" style={{ color: 'red' }} />
                            </div>
                            
                            <div className="form-group" style={{ marginBottom: "8px" }}>
                                <label htmlFor="confirmPassword" className="form-label" style={{ fontSize: "1rem", marginBottom: "3px" }}>Confirm Password</label>
                                <div className="password-input-container">
                                    <Field
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        style={{ padding: "8px 10px", fontSize: "1rem", width: "100%" }}
                                        disabled={!!signupSuccess}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password-button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        disabled={!!signupSuccess}
                                    >
                                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                <ErrorMessage name="confirmPassword" component="div" className="error-text" style={{ color: 'red' }} />
                            </div>

                            <div className="form-group" style={{ marginBottom: "8px" }}>
                                <label htmlFor="role" className="form-label" style={{ fontSize: "1rem", marginBottom: "3px" }}>Role</label>
                                <Field 
                                    as="select" 
                                    id="role" 
                                    name="role" 
                                    style={{ padding: "8px 10px", fontSize: "1rem", width: "100%" }}
                                    disabled={!!signupSuccess}
                                >

                                    <option value="customer">Customer</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="delivery_agent">Delivery Agent</option>
                                    <option value="admin">Admin</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="error-text" style={{ color: 'red' }} />
                            </div>
                            
                            <button 
                                type="submit" 
                                className="signin-button" 
                                style={{ 
                                    padding: "10px", 
                                    fontSize: "1rem", 
                                    marginTop: "8px",
                                    width: "100%",
                                    backgroundColor: "#ea580c",
                                    color: "white", 
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                                disabled={isSubmitting || !!signupSuccess}
                            >
                                {isSubmitting ? 'Creating Account...' : (signupSuccess ? 'Account Created!' : 'Sign Up')}
                            </button>
                            <button 
                                type="button"
                                className="signup-suggestion"
                                onClick={onSignInClick}
                                style={{ fontSize: "0.9rem", marginTop: "3px" }}
                                disabled={!!signupSuccess}
                            >
                                Already have an account? <span style={{ color: '#ea580c' }}>Sign In!</span>
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default SignupPopup;