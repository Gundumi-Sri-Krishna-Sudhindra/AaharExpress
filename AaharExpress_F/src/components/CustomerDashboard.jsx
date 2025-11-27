import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RoleDashboards.css';

const CustomerDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    savedAmount: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [recentOrders, setRecentOrders] = useState([]);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  // Mock data - in a real app this would come from API calls
  useEffect(() => {
    const fetchCustomerData = async () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          totalOrders: 24,
          pendingOrders: 2,
          completedOrders: 22,
          savedAmount: 56.75
        });
        
        setRecentOrders([
          { 
            id: 'ORD-125', 
            restaurant: 'Spice Garden', 
            restaurantAddress: '567 Curry Lane, New York, NY 10012',
            items: [
              { name: 'Butter Chicken', quantity: 1, price: 12.99 },
              { name: 'Garlic Naan', quantity: 2, price: 7.99 }
            ], 
            total: 28.97, 
            status: 'delivered', 
            date: '2023-07-15',
            deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
            estimatedDelivery: '7:30 PM',
            actualDelivery: '7:25 PM',
            paymentMethod: 'Credit Card',
            deliveryAgent: 'Mike Wilson',
            trackingSteps: [
              { status: 'Order Placed', time: '6:45 PM', completed: true },
              { status: 'Restaurant Confirmed', time: '6:50 PM', completed: true },
              { status: 'Food Preparation', time: '7:00 PM', completed: true },
              { status: 'Out for Delivery', time: '7:15 PM', completed: true },
              { status: 'Delivered', time: '7:25 PM', completed: true }
            ]
          },
          { 
            id: 'ORD-118', 
            restaurant: 'Pizza Palace', 
            restaurantAddress: '789 Pizza Ave, New York, NY 10013',
            items: [
              { name: 'Pepperoni Pizza', quantity: 1, price: 14.99 },
              { name: 'Garlic Bread', price: 4.99, quantity: 1 },
              { name: 'Soda', price: 2.49, quantity: 1 }
            ], 
            total: 22.50, 
            status: 'delivered', 
            date: '2023-07-10',
            deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
            estimatedDelivery: '8:00 PM',
            actualDelivery: '7:50 PM',
            paymentMethod: 'PayPal',
            deliveryAgent: 'Sarah Johnson',
            trackingSteps: [
              { status: 'Order Placed', time: '7:15 PM', completed: true },
              { status: 'Restaurant Confirmed', time: '7:20 PM', completed: true },
              { status: 'Food Preparation', time: '7:25 PM', completed: true },
              { status: 'Out for Delivery', time: '7:40 PM', completed: true },
              { status: 'Delivered', time: '7:50 PM', completed: true }
            ]
          },
          { 
            id: 'ORD-112', 
            restaurant: 'Burger Barn', 
            restaurantAddress: '321 Patty Road, New York, NY 10014',
            items: [
              { name: 'Double Cheeseburger', quantity: 2, price: 12.99 },
              { name: 'French Fries', quantity: 1, price: 4.99 },
              { name: 'Chocolate Shake', quantity: 1, price: 4.99 }
            ], 
            total: 35.80, 
            status: 'delivered', 
            date: '2023-07-05',
            deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
            estimatedDelivery: '6:30 PM',
            actualDelivery: '6:40 PM',
            paymentMethod: 'Credit Card',
            deliveryAgent: 'John Davis',
            trackingSteps: [
              { status: 'Order Placed', time: '5:45 PM', completed: true },
              { status: 'Restaurant Confirmed', time: '5:50 PM', completed: true },
              { status: 'Food Preparation', time: '6:00 PM', completed: true },
              { status: 'Out for Delivery', time: '6:20 PM', completed: true },
              { status: 'Delivered', time: '6:40 PM', completed: true }
            ]
          },
          { 
            id: 'ORD-126', 
            restaurant: 'Sushi World', 
            restaurantAddress: '123 Wasabi Way, New York, NY 10015',
            items: [
              { name: 'California Roll', quantity: 1, price: 12.99 },
              { name: 'Spicy Tuna Roll', quantity: 1, price: 14.99 },
              { name: 'Miso Soup', quantity: 1, price: 3.99 },
              { name: 'Green Tea', quantity: 2, price: 2.99 }
            ], 
            total: 42.30, 
            status: 'preparing', 
            date: '2023-07-16',
            deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
            estimatedDelivery: '7:45 PM',
            actualDelivery: null,
            paymentMethod: 'Credit Card',
            deliveryAgent: null,
            trackingSteps: [
              { status: 'Order Placed', time: '7:00 PM', completed: true },
              { status: 'Restaurant Confirmed', time: '7:05 PM', completed: true },
              { status: 'Food Preparation', time: 'In Progress', completed: false },
              { status: 'Out for Delivery', time: 'Pending', completed: false },
              { status: 'Delivered', time: 'Pending', completed: false }
            ]
          }
        ]);
        
        setFavoriteRestaurants([
          { id: 1, name: 'Spice Garden', cuisine: 'Indian', rating: 4.8, image: 'https://example.com/spice-garden.jpg' },
          { id: 2, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.5, image: 'https://example.com/pizza-palace.jpg' },
          { id: 3, name: 'Burger Barn', cuisine: 'American', rating: 4.3, image: 'https://example.com/burger-barn.jpg' }
        ]);
        
        setAddresses([
          { id: 1, label: 'Home', address: '123 Main St, Apt 4B, New York, NY 10001', isDefault: true },
          { id: 2, label: 'Work', address: '456 Business Ave, Suite 100, New York, NY 10002', isDefault: false },
          { id: 3, label: 'Mom\'s House', address: '789 Family Rd, New York, NY 10003', isDefault: false }
        ]);
        
        setRecommendations([
          { id: 101, name: 'Pad Thai', restaurant: 'Thai Delight', price: 14.99, image: 'https://example.com/pad-thai.jpg' },
          { id: 102, name: 'Chicken Tikka Masala', restaurant: 'Spice Garden', price: 16.99, image: 'https://example.com/tikka-masala.jpg' },
          { id: 103, name: 'Margherita Pizza', restaurant: 'Pizza Palace', price: 12.99, image: 'https://example.com/margherita.jpg' },
          { id: 104, name: 'Beef Tacos', restaurant: 'Taco Heaven', price: 9.99, image: 'https://example.com/beef-tacos.jpg' }
        ]);
        
        setLoading(false);
      }, 800);
    };
    
    fetchCustomerData();
  }, []);
  
  // Handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };
  
  // Handle reorder
  const handleReorder = (order) => {
    // In a real app, this would add items to cart and redirect to checkout
    alert(`Reordering items from ${order.restaurant}`);
  };
  
  // Close order details modal
  const closeOrderDetails = () => {
    setShowOrderDetails(false);
  };
  
  // Add new address
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    isDefault: false
  });
  
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.address) {
      alert('Please fill out all fields');
      return;
    }
    
    const addressToAdd = {
      id: addresses.length + 1,
      label: newAddress.label,
      address: newAddress.address,
      isDefault: newAddress.isDefault
    };
    
    // If new address is default, update other addresses
    let updatedAddresses = [...addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    setAddresses([...updatedAddresses, addressToAdd]);
    
    // Reset form and hide it
    setNewAddress({
      label: '',
      address: '',
      isDefault: false
    });
    setShowAddAddress(false);
  };
  
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  if (loading) {
    return (
      <div className="role-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading customer dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="role-dashboard customer-dashboard">
      <div className="dashboard-header">
        <h1>Customer Dashboard</h1>
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
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </button>
        <button 
          className={`tab-button ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
        <button 
          className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          Addresses
        </button>
      </div>
      
      {/* Order details modal */}
      {showOrderDetails && selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={closeOrderDetails}>×</button>
            
            <div className="order-details-header">
              <h2>Order #{selectedOrder.id}</h2>
              <span className={`status-badge ${selectedOrder.status}`}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </span>
            </div>
            
            <div className="order-info-grid">
              <div className="order-info-section">
                <h3>Order Information</h3>
                <p><strong>Restaurant:</strong> {selectedOrder.restaurant}</p>
                <p><strong>Date:</strong> {selectedOrder.date}</p>
                <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                {selectedOrder.deliveryAgent && (
                  <p><strong>Delivery Agent:</strong> {selectedOrder.deliveryAgent}</p>
                )}
                <p><strong>Estimated Delivery:</strong> {selectedOrder.estimatedDelivery}</p>
                {selectedOrder.actualDelivery && (
                  <p><strong>Actual Delivery:</strong> {selectedOrder.actualDelivery}</p>
                )}
              </div>
              
              <div className="order-items-section">
                <h3>Order Items</h3>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-right"><strong>Order Total:</strong></td>
                      <td><strong>${selectedOrder.total.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="order-tracking">
              <h3>Order Tracking</h3>
              <div className="tracking-timeline">
                {selectedOrder.trackingSteps.map((step, index) => (
                  <div key={index} className={`tracking-step ${step.completed ? 'completed' : ''}`}>
                    <div className="step-indicator"></div>
                    <div className="step-content">
                      <div className="step-status">{step.status}</div>
                      <div className="step-time">{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-actions">
              {selectedOrder.status === 'delivered' && (
                <button className="reorder-btn" onClick={() => handleReorder(selectedOrder)}>Reorder</button>
              )}
              <button className="help-btn">Need Help?</button>
              <button className="receipt-btn">Download Receipt</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <div className="stat-value">{stats.totalOrders}</div>
                <div className="stat-icon">📋</div>
              </div>
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <div className="stat-value">{stats.pendingOrders}</div>
                <div className="stat-icon">⏳</div>
              </div>
              <div className="stat-card">
                <h3>Completed Orders</h3>
                <div className="stat-value">{stats.completedOrders}</div>
                <div className="stat-icon">✅</div>
              </div>
              <div className="stat-card">
                <h3>Saved Amount</h3>
                <div className="stat-value">${stats.savedAmount.toFixed(2)}</div>
                <div className="stat-icon">💰</div>
              </div>
            </div>
            
            <div className="recommendations-section">
              <h3>Recommended For You</h3>
              <div className="recommendations-grid">
                {recommendations.map(item => (
                  <div key={item.id} className="recommendation-card">
                    <div className="recommendation-image">
                      {/* In a real app, this would be an actual image */}
                      <div className="placeholder-image">
                        {item.name[0]}
                      </div>
                    </div>
                    <div className="recommendation-details">
                      <h4>{item.name}</h4>
                      <p>{item.restaurant}</p>
                      <p className="recommendation-price">${item.price.toFixed(2)}</p>
                    </div>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="recent-orders-section">
              <h3>Recent Orders</h3>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Restaurant</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.restaurant}</td>
                      <td>{order.items.length}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <button className="view-order-btn" onClick={() => handleViewOrder(order)}>View</button>
                        {order.status === 'delivered' && (
                          <button className="reorder-btn" onClick={() => handleReorder(order)}>Reorder</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="view-all-btn" onClick={() => setActiveTab('orders')}>View All Orders</button>
            </div>
            
            <div className="favorite-restaurants">
              <h3>Your Favorite Restaurants</h3>
              <div className="restaurant-cards">
                {favoriteRestaurants.map(restaurant => (
                  <div key={restaurant.id} className="restaurant-card">
                    <div className="restaurant-image">
                      {/* In a real app, this would be an actual image */}
                      <div className="placeholder-image">
                        {restaurant.name[0]}
                      </div>
                    </div>
                    <h4>{restaurant.name}</h4>
                    <p>{restaurant.cuisine} Cuisine</p>
                    <div className="restaurant-rating">
                      <span>⭐ {restaurant.rating}</span>
                    </div>
                    <button className="order-now-btn">Order Now</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="orders-history">
            <h2>Order History</h2>
            
            <div className="order-filters">
              <div className="search-filter">
                <input type="text" placeholder="Search orders" />
                <button>Search</button>
              </div>
              
              <div className="status-filter">
                <select>
                  <option>All Orders</option>
                  <option>Active Orders</option>
                  <option>Completed Orders</option>
                  <option>Cancelled Orders</option>
                </select>
              </div>
              
              <div className="date-filter">
                <select>
                  <option>Any Time</option>
                  <option>Last 30 Days</option>
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>
            
            <div className="order-cards">
              {recentOrders.map(order => (
                <div key={order.id} className={`order-card ${order.status}`}>
                  <div className="order-card-header">
                    <div className="order-info">
                      <h3>{order.restaurant}</h3>
                      <span className="order-id">Order #{order.id}</span>
                      <span className="order-date">{order.date}</span>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-card-body">
                    <div className="order-items">
                      <p className="item-count">{order.items.length} items</p>
                      <ul className="item-list">
                        {order.items.slice(0, 2).map((item, index) => (
                          <li key={index}>{item.quantity}x {item.name}</li>
                        ))}
                        {order.items.length > 2 && (
                          <li className="more-items">+{order.items.length - 2} more items</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="order-total">
                      <p>Total: <strong>${order.total.toFixed(2)}</strong></p>
                    </div>
                  </div>
                  
                  <div className="order-card-footer">
                    <button 
                      className="view-details-btn"
                      onClick={() => handleViewOrder(order)}
                    >
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button 
                        className="reorder-btn"
                        onClick={() => handleReorder(order)}
                      >
                        Reorder
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button className="track-order-btn">Track Order</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'favorites' && (
          <div className="favorites-management">
            <h2>Favorite Restaurants & Dishes</h2>
            
            <div className="favorites-tabs">
              <button className="favorites-tab active">Restaurants</button>
              <button className="favorites-tab">Dishes</button>
            </div>
            
            <div className="favorite-restaurants-grid">
              {favoriteRestaurants.map(restaurant => (
                <div key={restaurant.id} className="favorite-restaurant-card">
                  <div className="restaurant-image-large">
                    {/* In a real app, this would be an actual image */}
                    <div className="placeholder-image">
                      {restaurant.name[0]}
                    </div>
                  </div>
                  
                  <div className="restaurant-details">
                    <h3>{restaurant.name}</h3>
                    <p>{restaurant.cuisine} Cuisine</p>
                    <div className="rating">
                      {'⭐'.repeat(Math.floor(restaurant.rating))}
                      {restaurant.rating % 1 >= 0.5 ? '⭐' : ''}
                      <span className="rating-value">{restaurant.rating}</span>
                    </div>
                  </div>
                  
                  <div className="restaurant-actions">
                    <button className="view-menu-btn">View Menu</button>
                    <button className="remove-favorite-btn">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'addresses' && (
          <div className="address-management">
            <h2>Delivery Addresses</h2>
            
            <div className="address-list">
              {addresses.map(address => (
                <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                  <div className="address-info">
                    <h3>{address.label}</h3>
                    <p>{address.address}</p>
                    {address.isDefault && <span className="default-badge">Default</span>}
                  </div>
                  <div className="address-actions">
                    <button className="edit-address-btn">Edit</button>
                    {!address.isDefault && (
                      <button className="set-default-btn">Set as Default</button>
                    )}
                    {!address.isDefault && (
                      <button className="delete-address-btn">Delete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="add-address-btn"
              onClick={() => setShowAddAddress(!showAddAddress)}
            >
              {showAddAddress ? 'Cancel' : '+ Add New Address'}
            </button>
            
            {showAddAddress && (
              <div className="add-address-form">
                <h3>Add New Address</h3>
                <form onSubmit={handleAddAddress}>
                  <div className="form-group">
                    <label htmlFor="label">Address Label*</label>
                    <input 
                      type="text" 
                      id="label" 
                      name="label" 
                      value={newAddress.label} 
                      onChange={handleAddressChange} 
                      placeholder="Home, Work, etc."
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="address">Address*</label>
                    <textarea 
                      id="address" 
                      name="address" 
                      value={newAddress.address} 
                      onChange={handleAddressChange} 
                      placeholder="Street, City, State, Zip Code"
                      required
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-group checkbox">
                    <label>
                      <input 
                        type="checkbox" 
                        name="isDefault" 
                        checked={newAddress.isDefault} 
                        onChange={handleAddressChange} 
                      />
                      Set as default delivery address
                    </label>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="save-address-btn">Save Address</button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setShowAddAddress(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard; 