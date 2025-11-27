import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import './Popup.css';
import logo from '/logo.webp';
import SignupPopup from './SignupPopup';
import ForgotPassword from './ForgotPassword';
import { loginSchema } from '../utils/validationSchemas';
import axios from 'axios';
import userService from '../services/userService';
import authService from '../services/authService';

const Popup = ({isOpen, onClose, onLogin}) => {
    const [showSignup, setShowSignup] = useState(false);
    const [showSignin, setShowSignin] = useState(true);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    if(!isOpen) return null;

    const handleSignupClick = () => {
        setShowSignin(false);
        setShowSignup(true);
        setShowPasswordReset(false);
    };

    const handleSigninClick = () => {
        setShowSignup(false);
        setShowSignin(true);
        setShowPasswordReset(false);
    };

    const handleForgotPassword = () => {
        setShowSignin(false);
        setShowSignup(false);
        setShowPasswordReset(true);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (values, { setSubmitting }) => {
        try {
            // Clear any previous messages
            setLoginError('');
            setLoginSuccess('');
            
            console.log('Popup: Login attempt for:', values.username);
            // Step 1: Use authService for login to get token
            const response = await authService.login(values.username, values.password);
            console.log('Popup: Login successful, response:', response);

            // Step 2: Ensure roles are properly formatted
            if (response.roles) {
                const formattedRoles = Array.isArray(response.roles) 
                    ? response.roles.map(role => {
                        const upperRole = typeof role === 'string' ? role.toUpperCase() : '';
                        return upperRole.startsWith('ROLE_') ? upperRole : `ROLE_${upperRole}`;
                      })
                    : [`ROLE_${response.roles.toString().toUpperCase()}`];
                
                console.log('Popup: Formatted roles:', formattedRoles);
                
                // Update user data in localStorage with formatted roles
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    try {
                        const userData = JSON.parse(userStr);
                        userData.roles = formattedRoles;
                        localStorage.setItem('user', JSON.stringify(userData));
                        console.log('Popup: Updated user data with formatted roles');
                    } catch (error) {
                        console.error('Popup: Error updating user roles:', error);
                    }
                }
            }

            // Show success message
            setLoginSuccess('✅ Successfully signed in! Loading your profile...');
            console.log('Popup: Login success message set');
            
            // If onLogin callback exists, pass the login data
            if (onLogin) {
                console.log('Popup: Using parent onLogin callback');
                // Wait for a moment to show the success message
                setTimeout(() => {
                    onLogin(values.username, values.password);
                }, 2000);
            } else {
                // If no callback, handle redirect here
                const username = response.username || values.username;
                
                try {
                    console.log('Popup: Fetching user details for:', username);
                    // Step 2: Fetch detailed user data
                    const userData = await userService.fetchUserAfterLogin(username);
                    console.log('Popup: User details fetched successfully:', userData);
                    
                    // Wait for a moment to show the success message, then redirect
                    setTimeout(() => {
                        console.log('Popup: Redirecting to home page...');
                        onClose();
                        // Use direct DOM approach for reliability
                        window.location.href = '/';
                    }, 2000);
                } catch (userError) {
                    console.error('Popup: Error fetching user details:', userError);
                    
                    // Even if we couldn't get detailed user info, we can still use basic info from login response
                    if (response && response.username) {
                        const basicUserData = {
                            id: response.id || 0,
                            username: response.username,
                            email: response.email || '',
                            roles: response.roles || ['ROLE_USER']
                        };
                        
                        console.log('Popup: Using basic user data from login response:', basicUserData);
                        localStorage.setItem('user', JSON.stringify(basicUserData));
                        
                        setTimeout(() => {
                            onClose();
                            window.location.href = '/';
                        }, 2000);
                    } else {
                        setLoginError('Error loading user data. Please try again.');
                    }
                }
            }
        } catch (error) {
            console.error('Popup: Login error:', error);
            if (error.response) {
                if (error.response.status === 401) {
                    setLoginError('Incorrect username or password.');
                } else {
                    setLoginError(error.response.data?.message || 'Unable to sign in. Please try again.');
                }
            } else if (error.request) {
                setLoginError('No response from server. Please check your connection.');
            } else {
                setLoginError('Unable to send request. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {showSignin && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-button" onClick={onClose}>×</button>
                        
                        <div className="popup-header">
                            <img src={logo} alt="Company Logo" className="popup-logo" />
                            <h2 className="popup-title">Sign In</h2>
                        </div>
                
                        <Formik
                            initialValues={{ username: '', password: '', rememberMe: false }}
                            validationSchema={loginSchema}
                            onSubmit={handleLogin}
                        >
                            {({ isSubmitting }) => (
                                <Form className="popup-form">
                                    {loginError && (
                                        <div className="error-message">
                                            {loginError}
                                        </div>
                                    )}
                                    
                                    {loginSuccess && (
                                        <div className="success-message">
                                            {loginSuccess}
                                        </div>
                                    )}
                                    
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-label form-label-xl">Username</label>
                                        <Field
                                            type="text"
                                            id="username"
                                            name="username"
                                            className="input-large"
                                            placeholder="Enter your username"
                                            disabled={!!loginSuccess}
                                        />
                                        <ErrorMessage name="username" component="div" className="error-text" />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="password" className="form-label form-label-xl">Password</label>
                                        <div className="password-input-container">
                                            <Field
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                className="input-large"
                                                placeholder="Enter your password"
                                                disabled={!!loginSuccess}
                                            />
                                            <button 
                                                type="button" 
                                                className="toggle-password-button"
                                                onClick={togglePasswordVisibility}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                disabled={!!loginSuccess}
                                            >
                                                {showPassword ? "👁️" : "👁️‍🗨️"}
                                            </button>
                                        </div>
                                        <ErrorMessage name="password" component="div" className="error-text" />
                                    </div>
                                    
                                    <div className="remember-forgot">
                                        <div className="remember-me">
                                            <Field
                                                type="checkbox"
                                                id="rememberMe"
                                                name="rememberMe"
                                                disabled={!!loginSuccess}
                                            />
                                            <label htmlFor="rememberMe">Remember me</label>
                                        </div>
                                        <button 
                                            type="button"
                                            className="forgot-password"
                                            onClick={handleForgotPassword}
                                            disabled={!!loginSuccess}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        className="signin-button"
                                        disabled={isSubmitting || loginSuccess}
                                    >
                                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                                    </button>
                                    <button 
                                        type="button"
                                        className="signup-suggestion"
                                        onClick={handleSignupClick}
                                        disabled={loginSuccess}
                                    >
                                        Don't have account? <span style={{ color: '#ea580c' }}>Sign Up!</span>
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
            
            {showSignup && (
                <SignupPopup 
                    isOpen={showSignup}
                    onClose={onClose}
                    onSignInClick={handleSigninClick}
                />
            )}

            {showPasswordReset && (
                <ForgotPassword
                    isOpen={showPasswordReset}
                    onClose={onClose}
                    onBackToSignIn={handleSigninClick}
                />
            )}
        </>
    );
};

export default Popup;