import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import './AccountSettings.css';

const AccountSettings = ({ user: initialUser, onUpdateUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser || {});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setFormData({
        name: initialUser.fullName || initialUser.name || '',
        email: initialUser.email || '',
        phone: initialUser.mobileNumber || initialUser.phone || '',
        address: initialUser.address || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [initialUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setEditMode(false);
    setMessage({ text: '', type: '' });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Reset form data to current user data when entering edit mode
      setFormData({
        name: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.mobileNumber || user.phone || '',
        address: user.address || '',
        password: '',
        confirmPassword: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Validate passwords if provided
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          setMessage({ text: 'Passwords do not match', type: 'error' });
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
          setLoading(false);
          return;
        }
      }

      // Prepare update data
      const updateData = {
        ...formData,
        // Only include password if it's provided
        ...(formData.password ? { password: formData.password } : {})
      };
      
      // Remove confirmPassword as it's not needed for the API
      delete updateData.confirmPassword;
      
      // Call API to update user
      const updatedUser = await userService.updateUserProfile(user.id, updateData);
      
      // Update local state
      setUser(updatedUser);
      setEditMode(false);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      // Notify parent component
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset form data to current user data
    setFormData({
      name: user.fullName || user.name || '',
      email: user.email || '',
      phone: user.mobileNumber || user.phone || '',
      address: user.address || '',
      password: '',
      confirmPassword: '',
    });
    setMessage({ text: '', type: '' });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="account-settings">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p>Manage your personal information and account preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <button 
            className={`sidebar-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            <span className="tab-icon">👤</span>
            Profile Information
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => handleTabChange('security')}
          >
            <span className="tab-icon">🔒</span>
            Security
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => handleTabChange('preferences')}
          >
            <span className="tab-icon">⚙️</span>
            Preferences
          </button>
          <button 
            className="sidebar-tab"
            onClick={() => navigate('/dashboard')}
          >
            <span className="tab-icon">📊</span>
            Dashboard
          </button>
        </div>

        <div className="settings-content">
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-settings">
              <div className="section-header">
                <h2>Personal Information</h2>
                <button 
                  className={`edit-button ${editMode ? 'cancel' : ''}`}
                  onClick={toggleEditMode}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Your address"
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="save-button"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-info">
                  <div className="info-item">
                    <span className="info-label">Username:</span>
                    <span className="info-value">{user.username || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Full Name:</span>
                    <span className="info-value">{user.fullName || user.name || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user.email || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{user.mobileNumber || user.phone || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address:</span>
                    <span className="info-value">{user.address || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Member Since:</span>
                    <span className="info-value">{formatDate(user.memberSince || user.createdAt)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-settings">
              <div className="section-header">
                <h2>Security Settings</h2>
              </div>

              <form onSubmit={handleSubmit} className="security-form">
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="password-requirements">
                  <p>Password must:</p>
                  <ul>
                    <li>Be at least 6 characters long</li>
                    <li>Include at least one letter and one number</li>
                  </ul>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="save-button"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              <div className="last-login">
                <h3>Account Activity</h3>
                <p>Last login: {formatDate(user.lastLogin || 'N/A')}</p>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preference-settings">
              <div className="section-header">
                <h2>Preferences</h2>
              </div>

              <div className="preferences-form">
                <div className="preference-section">
                  <h3>Notifications</h3>
                  <div className="preference-option">
                    <label>
                      <input type="checkbox" name="emailNotifications" />
                      Receive order updates via email
                    </label>
                  </div>
                  <div className="preference-option">
                    <label>
                      <input type="checkbox" name="smsNotifications" />
                      Receive order updates via SMS
                    </label>
                  </div>
                  <div className="preference-option">
                    <label>
                      <input type="checkbox" name="promotionalEmails" />
                      Receive promotional emails and special offers
                    </label>
                  </div>
                </div>

                <div className="preference-section">
                  <h3>Dietary Preferences</h3>
                  <div className="dietary-options">
                    <div className="preference-option">
                      <label>
                        <input type="checkbox" name="vegetarian" />
                        Vegetarian
                      </label>
                    </div>
                    <div className="preference-option">
                      <label>
                        <input type="checkbox" name="vegan" />
                        Vegan
                      </label>
                    </div>
                    <div className="preference-option">
                      <label>
                        <input type="checkbox" name="glutenFree" />
                        Gluten-Free
                      </label>
                    </div>
                    <div className="preference-option">
                      <label>
                        <input type="checkbox" name="dairyFree" />
                        Dairy-Free
                      </label>
                    </div>
                    <div className="preference-option">
                      <label>
                        <input type="checkbox" name="nutFree" />
                        Nut-Free
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="save-button">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 