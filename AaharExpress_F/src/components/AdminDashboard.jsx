import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RoleDashboards.css';
import authService from '../services/authService';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    activeDeliveries: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data - in a real app this would come from API calls
  useEffect(() => {
    const fetchAdminData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalUsers: 1245,
          totalRestaurants: 87,
          totalOrders: 5698,
          activeDeliveries: 32
        });
        setLoading(false);
      }, 800);
    };
    
    fetchAdminData();
  }, []);
  
  if (loading) {
    return (
      <div className="role-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="role-dashboard admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.fullName || user.username} | Role: Administrator</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'restaurants' ? 'active' : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          Restaurants
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-icon">👥</div>
              </div>
              <div className="stat-card">
                <h3>Total Restaurants</h3>
                <div className="stat-value">{stats.totalRestaurants}</div>
                <div className="stat-icon">🍽️</div>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <div className="stat-value">{stats.totalOrders}</div>
                <div className="stat-icon">📋</div>
              </div>
              <div className="stat-card">
                <h3>Active Deliveries</h3>
                <div className="stat-value">{stats.activeDeliveries}</div>
                <div className="stat-icon">🚚</div>
              </div>
            </div>
            
            <div className="admin-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button className="action-button">Add New Restaurant</button>
                <button className="action-button">Manage Users</button>
                <button className="action-button">View Reports</button>
                <button className="action-button">System Settings</button>
              </div>
            </div>
            
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-time">2 hours ago</span>
                  <span className="activity-text">New restaurant "Spice Garden" registered</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">5 hours ago</span>
                  <span className="activity-text">Customer complaint filed for order #45213</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">Yesterday</span>
                  <span className="activity-text">System update applied</span>
                </div>
                <div className="activity-item">
                  <span className="activity-time">2 days ago</span>
                  <span className="activity-text">New delivery agent approved</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-management">
            <h2>Users Management</h2>
            <p>This section would contain user management functionality for administrators.</p>
          </div>
        )}
        
        {activeTab === 'restaurants' && (
          <div className="restaurants-management">
            <h2>Restaurants Management</h2>
            <p>This section would contain restaurant management functionality for administrators.</p>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-management">
            <h2>Orders Management</h2>
            <p>This section would contain order management functionality for administrators.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 