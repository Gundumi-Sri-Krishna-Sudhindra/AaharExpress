import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RoleDashboards.css';

const DeliveryAgentDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    completedToday: 0,
    earnings: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showMap, setShowMap] = useState(false);
  
  // Mock data - in a real app this would come from API calls
  useEffect(() => {
    const fetchDeliveryData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalDeliveries: 152,
          pendingDeliveries: 3,
          completedToday: 7,
          earnings: 285.50
        });
        
        setActiveDeliveries([
          { 
            id: 'DEL-045', 
            restaurant: 'Spice Garden',
            restaurantAddress: '567 Curry Lane, New York, NY 10012',
            customer: 'John Doe',
            customerAddress: '123 Main St, Apt 4B, New York, NY 10001',
            status: 'pickup', 
            estimatedTime: '15 min',
            distance: '2.3 km',
            orderDetails: [
              { name: 'Butter Chicken', quantity: 1 },
              { name: 'Garlic Naan', quantity: 2 }
            ],
            total: 18.97,
            paymentMethod: 'Credit Card',
            coordinates: {
              restaurant: { lat: 40.723008, lng: -73.999619 },
              customer: { lat: 40.716880, lng: -74.005112 }
            }
          },
          { 
            id: 'DEL-046', 
            restaurant: 'Pizza Palace',
            restaurantAddress: '789 Pizza Ave, New York, NY 10013',
            customer: 'Jane Smith',
            customerAddress: '456 Oak Ave, New York, NY 10002',
            status: 'enroute', 
            estimatedTime: '8 min',
            distance: '1.5 km',
            orderDetails: [
              { name: 'Pepperoni Pizza', quantity: 1 },
              { name: 'Garlic Knots', quantity: 1 },
              { name: 'Soda', quantity: 2 }
            ],
            total: 24.50,
            paymentMethod: 'Cash on Delivery',
            coordinates: {
              restaurant: { lat: 40.720516, lng: -74.006254 },
              customer: { lat: 40.725378, lng: -73.998555 }
            }
          },
          { 
            id: 'DEL-047', 
            restaurant: 'Burger Barn',
            restaurantAddress: '321 Patty Road, New York, NY 10014',
            customer: 'Robert Johnson',
            customerAddress: '789 Pine Blvd, New York, NY 10003',
            status: 'assigned', 
            estimatedTime: '25 min',
            distance: '3.2 km',
            orderDetails: [
              { name: 'Cheeseburger', quantity: 2 },
              { name: 'French Fries', quantity: 1 },
              { name: 'Milkshake', quantity: 2 }
            ],
            total: 29.95,
            paymentMethod: 'Credit Card',
            coordinates: {
              restaurant: { lat: 40.731863, lng: -74.000564 },
              customer: { lat: 40.715001, lng: -73.990556 }
            }
          }
        ]);
        
        setDeliveryHistory([
          { id: 'DEL-044', restaurant: 'Sushi World', customer: 'Emily Brown', earnings: 12.50, date: '2023-07-16', rating: 5, address: '101 Lake View Dr, New York, NY 10004' },
          { id: 'DEL-043', restaurant: 'Taco Time', customer: 'Michael Wilson', earnings: 10.75, date: '2023-07-16', rating: 4, address: '202 Park Ave, New York, NY 10005' },
          { id: 'DEL-042', restaurant: 'Pasta Place', customer: 'Sarah Davis', earnings: 14.25, date: '2023-07-15', rating: 5, address: '303 River Road, New York, NY 10006' },
          { id: 'DEL-041', restaurant: 'Spice Garden', customer: 'Thomas Miller', earnings: 11.50, date: '2023-07-15', rating: 4, address: '404 Broadway, New York, NY 10007' }
        ]);
        
        setLoading(false);
      }, 800);
    };
    
    fetchDeliveryData();
  }, []);

  // Function to update delivery status
  const updateDeliveryStatus = (deliveryId, newStatus) => {
    setActiveDeliveries(
      activeDeliveries.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: newStatus } 
          : delivery
      )
    );

    // If delivery is completed, remove it from active and add to history
    if (newStatus === 'completed') {
      const completedDelivery = activeDeliveries.find(d => d.id === deliveryId);
      
      if (completedDelivery) {
        // Add to history
        const historyEntry = {
          id: completedDelivery.id,
          restaurant: completedDelivery.restaurant,
          customer: completedDelivery.customer,
          earnings: (completedDelivery.total * 0.10).toFixed(2), // 10% of order as earnings
          date: new Date().toLocaleDateString(),
          rating: 0, // No rating yet
          address: completedDelivery.customerAddress
        };
        
        setDeliveryHistory([historyEntry, ...deliveryHistory]);
        
        // Update stats
        setStats({
          ...stats,
          pendingDeliveries: stats.pendingDeliveries - 1,
          completedToday: stats.completedToday + 1,
          earnings: stats.earnings + parseFloat(historyEntry.earnings)
        });
        
        // After a short delay, remove from active deliveries
        setTimeout(() => {
          setActiveDeliveries(activeDeliveries.filter(d => d.id !== deliveryId));
        }, 2000);
      }
    }
  };

  // Toggle map view of a specific delivery
  const toggleMapView = (delivery) => {
    setSelectedDelivery(delivery);
    setShowMap(!showMap);
  };
  
  if (loading) {
    return (
      <div className="role-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading delivery agent dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="role-dashboard delivery-dashboard">
      <div className="dashboard-header">
        <h1>Delivery Agent Dashboard</h1>
        <p>Welcome, {user.fullName || user.username}</p>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Deliveries
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button 
          className={`tab-button ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('earnings')}
        >
          Earnings
        </button>
      </div>
      
      {/* Map View Popup */}
      {showMap && selectedDelivery && (
        <div className="map-popup">
          <div className="map-popup-content">
            <button className="close-map-btn" onClick={() => setShowMap(false)}>×</button>
            <h3>Delivery Route - {selectedDelivery.id}</h3>
            
            <div className="map-container">
              {/* In a real app, this would be an actual map implementation */}
              <div className="mock-map">
                <div className="map-placeholder">
                  <h4>Interactive Map Would Display Here</h4>
                  <p>From: {selectedDelivery.restaurantAddress}</p>
                  <p>To: {selectedDelivery.customerAddress}</p>
                  <p>Distance: {selectedDelivery.distance}</p>
                </div>
              </div>
            </div>
            
            <div className="location-details">
              <div className="location-point">
                <div className="location-icon restaurant">🍽️</div>
                <div className="location-info">
                  <h4>{selectedDelivery.restaurant}</h4>
                  <p>{selectedDelivery.restaurantAddress}</p>
                </div>
              </div>
              
              <div className="route-line">
                <span className="distance-label">{selectedDelivery.distance}</span>
              </div>
              
              <div className="location-point">
                <div className="location-icon customer">🏠</div>
                <div className="location-info">
                  <h4>{selectedDelivery.customer}</h4>
                  <p>{selectedDelivery.customerAddress}</p>
                </div>
              </div>
            </div>
            
            <div className="navigation-buttons">
              <button className="start-navigation-btn">Start Navigation</button>
              <button className="show-directions-btn">Show Turn-by-Turn Directions</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Deliveries</h3>
                <div className="stat-value">{stats.totalDeliveries}</div>
                <div className="stat-icon">🚚</div>
              </div>
              <div className="stat-card">
                <h3>Pending Deliveries</h3>
                <div className="stat-value">{stats.pendingDeliveries}</div>
                <div className="stat-icon">⏳</div>
              </div>
              <div className="stat-card">
                <h3>Completed Today</h3>
                <div className="stat-value">{stats.completedToday}</div>
                <div className="stat-icon">✅</div>
              </div>
              <div className="stat-card">
                <h3>Today's Earnings</h3>
                <div className="stat-value">${stats.earnings.toFixed(2)}</div>
                <div className="stat-icon">💰</div>
              </div>
            </div>
            
            <div className="active-deliveries-section">
              <h3>Active Deliveries</h3>
              <div className="delivery-cards">
                {activeDeliveries.map(delivery => (
                  <div key={delivery.id} className={`delivery-card ${delivery.status}`}>
                    <div className="delivery-header">
                      <h4>Order {delivery.id}</h4>
                      <span className={`status-badge ${delivery.status}`}>
                        {delivery.status === 'pickup' ? 'Ready for Pickup' : 
                         delivery.status === 'enroute' ? 'En Route' : 'Assigned'}
                      </span>
                    </div>
                    <div className="delivery-details">
                      <p><strong>Restaurant:</strong> {delivery.restaurant}</p>
                      <p><strong>Customer:</strong> {delivery.customer}</p>
                      <p><strong>Address:</strong> {delivery.customerAddress}</p>
                      <p><strong>Est. Time:</strong> {delivery.estimatedTime}</p>
                      <p><strong>Distance:</strong> {delivery.distance}</p>
                      <p><strong>Payment:</strong> {delivery.paymentMethod}</p>
                      <p><strong>Items:</strong> {delivery.orderDetails.map(item => 
                        `${item.quantity}x ${item.name}`).join(', ')}
                      </p>
                    </div>
                    <div className="delivery-actions">
                      {delivery.status === 'assigned' && (
                        <button 
                          className="action-button"
                          onClick={() => updateDeliveryStatus(delivery.id, 'pickup')}
                        >
                          Start Pickup
                        </button>
                      )}
                      {delivery.status === 'pickup' && (
                        <button 
                          className="action-button"
                          onClick={() => updateDeliveryStatus(delivery.id, 'enroute')}
                        >
                          Confirm Pickup
                        </button>
                      )}
                      {delivery.status === 'enroute' && (
                        <button 
                          className="action-button"
                          onClick={() => updateDeliveryStatus(delivery.id, 'completed')}
                        >
                          Complete Delivery
                        </button>
                      )}
                      <button 
                        className="map-button"
                        onClick={() => toggleMapView(delivery)}
                      >
                        View Map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="recent-deliveries">
              <h3>Recent Deliveries</h3>
              <table className="deliveries-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Restaurant</th>
                    <th>Customer</th>
                    <th>Earnings</th>
                    <th>Date</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryHistory.map(delivery => (
                    <tr key={delivery.id}>
                      <td>{delivery.id}</td>
                      <td>{delivery.restaurant}</td>
                      <td>{delivery.customer}</td>
                      <td>${parseFloat(delivery.earnings).toFixed(2)}</td>
                      <td>{delivery.date}</td>
                      <td>{'⭐'.repeat(delivery.rating)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'active' && (
          <div className="active-deliveries-page">
            <h2>Active Deliveries</h2>
            
            {activeDeliveries.length === 0 ? (
              <div className="no-deliveries">
                <p>You have no active deliveries at the moment.</p>
                <button className="refresh-btn">Check for New Deliveries</button>
              </div>
            ) : (
              <div className="active-delivery-list">
                {activeDeliveries.map(delivery => (
                  <div key={delivery.id} className={`delivery-card detailed ${delivery.status}`}>
                    <div className="delivery-card-grid">
                      <div className="delivery-main-info">
                        <div className="delivery-header">
                          <h3>Delivery {delivery.id}</h3>
                          <span className={`status-badge ${delivery.status}`}>
                            {delivery.status === 'pickup' ? 'Ready for Pickup' : 
                             delivery.status === 'enroute' ? 'En Route' : 'Assigned'}
                          </span>
                        </div>
                        
                        <div className="delivery-locations">
                          <div className="pickup-location">
                            <div className="location-icon">🍽️</div>
                            <div className="location-details">
                              <h4>Pickup from</h4>
                              <p className="location-name">{delivery.restaurant}</p>
                              <p className="location-address">{delivery.restaurantAddress}</p>
                            </div>
                          </div>
                          
                          <div className="location-divider">
                            <div className="divider-line"></div>
                            <div className="distance-badge">{delivery.distance}</div>
                          </div>
                          
                          <div className="dropoff-location">
                            <div className="location-icon">🏠</div>
                            <div className="location-details">
                              <h4>Deliver to</h4>
                              <p className="location-name">{delivery.customer}</p>
                              <p className="location-address">{delivery.customerAddress}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="delivery-actions full-width">
                          {delivery.status === 'assigned' && (
                            <button 
                              className="action-button"
                              onClick={() => updateDeliveryStatus(delivery.id, 'pickup')}
                            >
                              Start Pickup
                            </button>
                          )}
                          {delivery.status === 'pickup' && (
                            <button 
                              className="action-button"
                              onClick={() => updateDeliveryStatus(delivery.id, 'enroute')}
                            >
                              Confirm Pickup
                            </button>
                          )}
                          {delivery.status === 'enroute' && (
                            <button 
                              className="action-button"
                              onClick={() => updateDeliveryStatus(delivery.id, 'completed')}
                            >
                              Complete Delivery
                            </button>
                          )}
                          <button 
                            className="map-button"
                            onClick={() => toggleMapView(delivery)}
                          >
                            Navigate
                          </button>
                        </div>
                      </div>
                      
                      <div className="delivery-order-details">
                        <h4>Order Details</h4>
                        <ul className="order-items-list">
                          {delivery.orderDetails.map((item, index) => (
                            <li key={index}>{item.quantity}x {item.name}</li>
                          ))}
                        </ul>
                        <p className="order-total"><strong>Total:</strong> ${delivery.total.toFixed(2)}</p>
                        <p className="payment-method"><strong>Payment:</strong> {delivery.paymentMethod}</p>
                        
                        <div className="delivery-contact">
                          <button className="contact-btn customer">
                            <span className="icon">📞</span> Call Customer
                          </button>
                          <button className="contact-btn restaurant">
                            <span className="icon">📞</span> Call Restaurant
                          </button>
                          <button className="contact-btn support">
                            <span className="icon">🆘</span> Support
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="delivery-history">
            <h2>Delivery History</h2>
            
            <div className="history-filters">
              <div className="date-range">
                <label>Date Range:</label>
                <select>
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Custom Range</option>
                </select>
              </div>
              
              <div className="search-filter">
                <input type="text" placeholder="Search by order ID or customer" />
                <button className="search-btn">Search</button>
              </div>
            </div>
            
            <div className="history-table-container">
              <table className="deliveries-table full-width">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Restaurant</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Earnings</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryHistory.map(delivery => (
                    <tr key={delivery.id}>
                      <td>{delivery.id}</td>
                      <td>{delivery.date}</td>
                      <td>{delivery.restaurant}</td>
                      <td>{delivery.customer}</td>
                      <td className="address-cell">{delivery.address}</td>
                      <td>${parseFloat(delivery.earnings).toFixed(2)}</td>
                      <td>{'⭐'.repeat(delivery.rating)}</td>
                      <td>
                        <button className="view-details-btn">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="pagination">
              <button className="page-btn">Previous</button>
              <span className="page-indicator">Page 1 of 1</span>
              <button className="page-btn">Next</button>
            </div>
          </div>
        )}
        
        {activeTab === 'earnings' && (
          <div className="earnings-management">
            <h2>Earnings & Payments</h2>
            
            <div className="earnings-summary">
              <div className="earnings-cards">
                <div className="earning-card">
                  <h3>Today's Earnings</h3>
                  <div className="amount">${stats.earnings.toFixed(2)}</div>
                  <div className="deliveries-count">{stats.completedToday} Deliveries</div>
                </div>
                
                <div className="earning-card">
                  <h3>This Week</h3>
                  <div className="amount">$145.75</div>
                  <div className="deliveries-count">18 Deliveries</div>
                </div>
                
                <div className="earning-card">
                  <h3>This Month</h3>
                  <div className="amount">$685.50</div>
                  <div className="deliveries-count">72 Deliveries</div>
                </div>
                
                <div className="earning-card">
                  <h3>All Time</h3>
                  <div className="amount">$3,285.25</div>
                  <div className="deliveries-count">{stats.totalDeliveries} Deliveries</div>
                </div>
              </div>
              
              <div className="earnings-chart">
                <h3>Earnings Trend</h3>
                <div className="chart-placeholder">
                  <p>Earnings chart would be displayed here</p>
                </div>
              </div>
              
              <div className="payment-methods">
                <h3>Payment Methods</h3>
                <div className="payment-method-card active">
                  <div className="payment-icon">💳</div>
                  <div className="payment-details">
                    <h4>Direct Deposit (Default)</h4>
                    <p>Bank of America ****1234</p>
                    <p>Weekly payments every Monday</p>
                  </div>
                </div>
                
                <button className="add-payment-method">+ Add Payment Method</button>
              </div>
              
              <div className="payment-history">
                <h3>Payment History</h3>
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>July 10, 2023</td>
                      <td>$142.50</td>
                      <td>Direct Deposit</td>
                      <td><span className="status completed">Completed</span></td>
                      <td><button className="view-receipt-btn">Receipt</button></td>
                    </tr>
                    <tr>
                      <td>July 3, 2023</td>
                      <td>$165.75</td>
                      <td>Direct Deposit</td>
                      <td><span className="status completed">Completed</span></td>
                      <td><button className="view-receipt-btn">Receipt</button></td>
                    </tr>
                    <tr>
                      <td>June 26, 2023</td>
                      <td>$128.25</td>
                      <td>Direct Deposit</td>
                      <td><span className="status completed">Completed</span></td>
                      <td><button className="view-receipt-btn">Receipt</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="tax-info">
                <h3>Tax Information</h3>
                <p>Download your earnings statements for tax purposes:</p>
                <div className="tax-buttons">
                  <button className="tax-btn">2023 YTD Statement</button>
                  <button className="tax-btn">2022 Annual Statement</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryAgentDashboard; 