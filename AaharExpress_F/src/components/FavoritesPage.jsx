import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './FavoritesPage.css';

const FavoritesPage = ({ onAddToCart }) => {
  const [favorites, setFavorites] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  // Load favorites and restaurants from localStorage on component mount
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavoriteIds = JSON.parse(localStorage.getItem('favoriteItems')) || [];
      
      // If we have menu items in localStorage, use them to populate favorites
      const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
      const savedRestaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
      
      setRestaurants(savedRestaurants);
      
      if (menuItems.length > 0) {
        const favoriteItems = menuItems.filter(item => savedFavoriteIds.includes(item.id));
        setFavorites(favoriteItems);
      }
    };
    
    loadFavorites();
  }, []);

  // Handle removing an item from favorites
  const handleRemoveFavorite = (itemId) => {
    // Update local state
    setFavorites(favorites.filter(item => item.id !== itemId));
    
    // Update localStorage
    const savedFavoriteIds = JSON.parse(localStorage.getItem('favoriteItems')) || [];
    const updatedFavoriteIds = savedFavoriteIds.filter(id => id !== itemId);
    localStorage.setItem('favoriteItems', JSON.stringify(updatedFavoriteIds));
  };

  // Navigate back to menu page
  const handleBrowseMenu = () => {
    navigate('/');
  };

  // Function to render star ratings (copied from MenuPage for consistency)
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star full">★</span>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return (
      <div className="rating-stars">
        {stars}
        <span className="rating-value">({rating})</span>
      </div>
    );
  };

  return (
    <div className="favorites-page">
      <Navbar 
        cartItemCount={0} 
        favoriteCount={favorites.length} 
        onCartClick={() => navigate('/')}
      />
      
      <div className="favorites-container container">
        <h1 className="favorites-title">Your Favorites</h1>
        
        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <p>You haven't added any items to your favorites yet.</p>
            <button onClick={handleBrowseMenu} className="browse-menu-link">Browse Menu</button>
          </div>
        ) : (
          <div className="menu-grid">
            {favorites.map((item) => (
              <div className="menu-item" key={item.id}>
                <div className="menu-item-image">
                  <img src={item.image || '/api/placeholder/400/300'} alt={item.name} />
                  {item.bestSeller && <div className="bestseller-tag">Bestseller</div>}
                  <div className="restaurant-tag">
                    {restaurants.find(r => r.id === item.restaurant)?.name || 'Restaurant'}
                  </div>
                  <button 
                    className="favorite-button favorited"
                    onClick={() => handleRemoveFavorite(item.id)}
                    title="Remove from favorites"
                    aria-label="Remove from favorites"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(255, 107, 107, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '0',
                      zIndex: '10',
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    ❤️
                  </button>
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-info">
                    <h3 className="menu-item-name">
                      {item.name}
                      {item.isVeg ? (
                        <span className="veg-indicator">🟢</span>
                      ) : (
                        <span className="non-veg-indicator">🔴</span>
                      )}
                      {item.isSpicy && <span className="spicy-indicator">🌶️</span>}
                    </h3>
                    <p className="menu-item-price">₹{item.price.toFixed(2)}</p>
                  </div>
                  <p className="item-quantity text-black">({item.quantity})</p>

                  {renderRatingStars(item.rating)}
                  <p className="menu-item-description">{item.description}</p>
                  <div className="menu-item-details" style={{ display: 'flex', gap: '120px' }}>
                    <div className="detail-item serving-size">
                      <span className="detail-icon">👥</span>
                      <span className="detail-text">{item.servingSize}</span>
                    </div>
                    <div className="detail-item delivery-estimate">
                      <span className="detail-icon">⏱️</span>
                      <span className="detail-text">
                        {restaurants.find(r => r.id === item.restaurant)?.deliveryTime || '30-40 min'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Area information with increased margin-bottom */}
                  <div className="restaurant-area-info" style={{ 
                    marginTop: '10px', 
                    marginBottom: '20px', 
                    fontSize: '14px', 
                    color: '#666', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                  }}>
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">
                      {restaurants.find(r => r.id === item.restaurant)?.area || 'Location'}
                    </span>
                  </div>
                  
                  <div style={{ marginTop: 'auto' }}> {/* This pushes the button to the bottom */}
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => onAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;