import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const UserProfile = ({ user, orders, onViewOrder }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  
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

  const getStatusClass = (status) => {
    switch(status) {
      case 'processing': return 'status-processing';
      case 'preparing': return 'status-preparing';
      case 'delivery': return 'status-delivery';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  // Safely access user properties
  const userName = user?.fullName || user?.name || 'User';
  const userEmail = user?.email || 'No email provided';
  const userMemberSince = user?.memberSince || new Date().toISOString();
  const userPhone = user?.mobileNumber || user?.phone || 'Not provided';
  const userAddress = user?.address || 'No address saved';
  const userPaymentMethods = user?.paymentMethods || [];
  const userPreferences = user?.preferences || {
    emailNotifications: false,
    smsNotifications: false,
    marketingEmails: false,
    dietaryPreferences: []
  };

  return (
    <div className="user-profile">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={`${userName}'s profile`} />
            ) : (
              <div className="avatar-placeholder">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>{userName}</h1>
            <p>{userEmail}</p>
            <p>Member since: {formatDate(userMemberSince)}</p>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Personal Info
          </button>
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Order History
          </button>
          <button 
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="personal-info">
              <h2>Personal Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <h3>Contact Details</h3>
                  <p><strong>Phone:</strong> {userPhone}</p>
                  <p><strong>Email:</strong> {userEmail}</p>
                </div>
                <div className="info-item">
                  <h3>Delivery Address</h3>
                  <p>{userAddress}</p>
                </div>
                <div className="info-item">
                  <h3>Payment Methods</h3>
                  {userPaymentMethods && userPaymentMethods.length > 0 ? (
                    userPaymentMethods.map((method, index) => (
                      <p key={index}>
                        {method.type}: **** **** **** {method.lastFour}
                      </p>
                    ))
                  ) : (
                    <p>No payment methods saved</p>
                  )}
                </div>
              </div>
              <button className="edit-button">Edit Profile</button>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="order-history">
              <h2>Order History</h2>
              {orders && orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Order #{order.id.substring(order.id.indexOf('-') + 1)}</h3>
                          <p className="order-date">{formatDate(order.timestamp)}</p>
                        </div>
                        <div className="order-status">
                          <span className={`status-badge ${getStatusClass(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="order-summary">
                        <p><strong>Items:</strong> {order.items ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0}</p>
                        <p><strong>Total:</strong> ${order.total ? order.total.toFixed(2) : '0.00'}</p>
                      </div>
                      <div className="order-actions">
                        <button 
                          className="track-button"
                          onClick={() => {
                            if (typeof onViewOrder === 'function') {
                              onViewOrder(order);
                              navigate('/tracking');
                            }
                          }}
                        >
                          Track Order
                        </button>
                        <button className="reorder-button">Reorder</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-orders">
                  <p>You haven't placed any orders yet.</p>
                  <button 
                    className="browse-menu-button"
                    onClick={() => navigate('/')}
                  >
                    Browse Menu
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences">
              <h2>Account Preferences</h2>
              <div className="preference-section">
                <h3>Notification Settings</h3>
                <div className="preference-options">
                  <div className="preference-option">
                    <label>
                      <input 
                        type="checkbox" 
                        defaultChecked={userPreferences?.emailNotifications} 
                      />
                      Email notifications for order updates
                    </label>
                  </div>
                  <div className="preference-option">
                    <label>
                      <input 
                        type="checkbox" 
                        defaultChecked={userPreferences?.smsNotifications} 
                      />
                      SMS notifications for order updates
                    </label>
                  </div>
                  <div className="preference-option">
                    <label>
                      <input 
                        type="checkbox" 
                        defaultChecked={userPreferences?.marketingEmails} 
                      />
                      Marketing emails and special offers
                    </label>
                  </div>
                </div>
              </div>
              <div className="preference-section">
                <h3>Dietary Preferences</h3>
                <div className="dietary-tags">
                  {['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free'].map(pref => (
                    <label key={pref} className="dietary-tag">
                      <input 
                        type="checkbox" 
                        defaultChecked={userPreferences?.dietaryPreferences?.includes(pref)} 
                      />
                      {pref}
                    </label>
                  ))}
                </div>
              </div>
              <button className="save-button">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;