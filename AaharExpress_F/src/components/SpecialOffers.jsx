import React, { useState, useEffect } from 'react';
import './SpecialOffers.css';
import butterchickencombo from '../assets/butterchickencombo.webp';
import maharajathali from '../assets/maharajathali.webp';
import southindianfeast from '../assets/southindianfeast.webp';
import streetfoodplatter from '../assets/streetfoodplatter.webp';
import chillscoopsdelight from '../assets/chillscoopsdelight.webp';
import wrapbitecombo from '../assets/wrapbitecombo.webp'
const SpecialOffers = ({ onAddToCart }) => {
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // State for favorites
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavoriteIds = JSON.parse(localStorage.getItem('favoriteItems')) || [];
    setFavorites(savedFavoriteIds);
  }, []);

  // Restaurant data with areas
  const restaurants = {
    'punjab-palace': { name: 'Punjab Palace', area: 'Koramangala' },
    'south-spice': { name: 'South Spice', area: 'Indiranagar' },
    'mumbai-street': { name: 'Mumbai Street Food', area: 'HSR Layout' },
    'curry-palace': { name: 'Curry Palace', area: 'Gachibowli' },
    'chill-scoops': { name: 'Chill Scoops', area: 'Himayat Nagar'},
  'wrap-n-bites' : {name: 'Wrap & Bites', area: 'Punjagutta'}
    
    
  };

  // Special offers data with added delivery and serving information
  const specialOffers = [
    {
      id: 'offer-butter-chicken',
      name: 'Butter Chicken Combo',
      description: 'Creamy butter chicken with garlic naan and jeera rice',
      originalPrice: 450,
      offerPrice: 360,
      discount: '20%',
      image: butterchickencombo,
      restaurant: 'punjab-palace',
      rating: 4.8,
      isVeg: false,
      isSpicy: false,
      category: 'main-course',
      deliveryTime: '30-40',
      servingSize: 'Serves 2 '
    },
    {
      id: 'offer-thali',
      name: 'Maharaja Thali',
      description: 'Complete meal with 2 curries, dal, rice, bread, dessert and papad',
      originalPrice: 550,
      offerPrice: 440,
      discount: '20%',
      image: maharajathali,
      restaurant: 'curry-palace',
      rating: 4.7,
      isVeg: true,
      isSpicy: false,
      category: 'main-course',
      deliveryTime: '35-45',
      servingSize: 'Serves 1-2 '
    },
    {
      id: 'offer-south-combo',
      name: 'South Indian Feast',
      description: 'Masala dosa, idli, vada with sambar and chutney',
      originalPrice: 380,
      offerPrice: 299,
      discount: '21%',
      image: southindianfeast,
      restaurant: 'south-spice',
      rating: 4.6,
      isVeg: true,
      isSpicy: true,
      category: 'breakfast',
      deliveryTime: '25-35',
      servingSize: 'Serves 2 '
    },
    {
      id: 'offer-street-food',
      name: 'Street Food Platter',
      description: 'Selection of pani puri, bhel puri, pav bhaji and samosa',
      originalPrice: 350,
      offerPrice: 280,
      discount: '20%',
      image: streetfoodplatter,
      restaurant: 'mumbai-street',
      rating: 4.5,
      isVeg: true,
      isSpicy: true,
      category: 'starters',
      deliveryTime: '20-30',
      servingSize: 'Serves 3-4 '
    },
    {
      id: 'chill-scoops-delight',
      name: 'Ice Cream Combo',
      description: 'A delightful mix of chocolate, vanilla, and strawberry scoops topped with nuts and syrup',
      originalPrice: 400,
      offerPrice: 320,
      discount: '20%',
      image: chillscoopsdelight,
      restaurant: 'chill-scoops',
      rating: 4.6,
      isVeg: true,
      isSpicy: false,
      category: 'desserts',
      deliveryTime: '15-30 ',
      servingSize: 'Serves 1-2 '
    },
    {
      id: 'wrap-bites-combo',
      name: 'Wrap & Bites Combo',
      description: 'A delightful combo featuring Paneer Sandwich, Paneer Pizza, Veg Burger, and Veg Bites',
      originalPrice: 700,
      offerPrice: 525,
      discount: '25%',
      image: wrapbitecombo,
      restaurant: 'wrap-n-bites',
      rating: 4.4,
      isVeg: true,
      isSpicy: false,
      category: 'rolls & sandwiches',
      deliveryTime: '20-35 min',
      servingSize: 'Serves 1-3'
    }
    
  ];

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { ...prevTime, hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        } else if (prevTime.days > 0) {
          return { ...prevTime, days: prevTime.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          // Reset timer when it reaches zero
          return { days: 2, hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to toggle favorite status
  const toggleFavorite = (item) => {
    const savedFavoriteIds = JSON.parse(localStorage.getItem('favoriteItems')) || [];
    
    // Check if item is already in favorites
    const isFavorite = savedFavoriteIds.includes(item.id);
    
    let updatedFavoriteIds;
    if (isFavorite) {
      // Remove from favorites
      updatedFavoriteIds = savedFavoriteIds.filter(id => id !== item.id);
    } else {
      // Add to favorites
      updatedFavoriteIds = [...savedFavoriteIds, item.id];
      
      // Also ensure the item is available in menuItems for the favorites page
      const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
      
      // Convert offer to menu item format and add if not already there
      const menuItem = {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.offerPrice,
        category: item.category,
        restaurant: item.restaurant,
        image: item.image,
        isVeg: item.isVeg,
        isSpicy: item.isSpicy,
        rating: item.rating,
        deliveryTime: item.deliveryTime,
        servingSize: item.servingSize
      };
      
      if (!menuItems.some(menuItem => menuItem.id === item.id)) {
        localStorage.setItem('menuItems', JSON.stringify([...menuItems, menuItem]));
      }
    }
    
    // Update localStorage and state
    localStorage.setItem('favoriteItems', JSON.stringify(updatedFavoriteIds));
    setFavorites(updatedFavoriteIds);
  };

  // Function to render star ratings
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

  // Add to cart handler
  const handleAddToCart = (offer) => {
    // Convert the offer to a format compatible with the cart items
    const cartItem = {
      id: offer.id,
      name: offer.name,
      description: offer.description,
      price: offer.offerPrice,
      category: offer.category,
      restaurant: offer.restaurant,
      image: offer.image,
      isVeg: offer.isVeg,
      isSpicy: offer.isSpicy,
      rating: offer.rating,
      deliveryTime: offer.deliveryTime,
      servingSize: offer.servingSize
    };
    
    onAddToCart(cartItem);
  };

  return (
    <section className="special-offers-section">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Special Offers</h2>
          <p className="section-subtitle">Limited time deals on our best dishes</p>
        </div>
        
        <div className="countdown-timer">
          <p className="countdown-text">Offers End In:</p>
          <div className="countdown-digits">
            <div className="countdown-unit">
              <div className="countdown-number">{timeLeft.days.toString().padStart(2, '0')}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-unit">
              <div className="countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-unit">
              <div className="countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</div>
              <div className="countdown-label">Mins</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-unit">
              <div className="countdown-number">{timeLeft.seconds.toString().padStart(2, '0')}</div>
              <div className="countdown-label">Secs</div>
            </div>
          </div>
        </div>
        
        <div className="special-offers-grid">
          {specialOffers.map((offer) => (
            <div className="special-offer-card" key={offer.id}>
              <div className="offer-tag">{offer.discount} OFF</div>
              <div className="offer-image-container">
                <img src={offer.image} alt={offer.name} className="offer-image" />
                <div className="restaurant-tag">
                  {restaurants[offer.restaurant].name}
                </div>
                <button 
                  className={`favorite-button ${favorites.includes(offer.id) ? 'favorited' : ''}`}
                  onClick={() => toggleFavorite(offer)}
                >
                  {favorites.includes(offer.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="offer-content">
                <h3 className="offer-title">
                  {offer.name}
                  {offer.isVeg ? (
                    <span className="veg-indicator">🟢</span>
                  ) : (
                    <span className="non-veg-indicator">🔴</span>
                  )}
                  {offer.isSpicy && <span className="spicy-indicator">🌶️</span>}
                </h3>
                
                {/* Price moved right after recipe name */}
                <div className="offer-price-container">
                  <span className="offer-price">₹{offer.offerPrice.toFixed(2)}</span>
                  <span className="offer-original-price">₹{offer.originalPrice.toFixed(2)}</span>
                </div>
                
                {renderRatingStars(offer.rating)}
                <p className="offer-description">{offer.description}</p>
                
                {/* Menu item details section */}
                <div className="menu-item-details" style={{ display: 'flex', gap: '120px' }}>
                  <div className="detail-item serving-size">
                    <span className="detail-icon">👥</span>
                    <span className="detail-text">{offer.servingSize}</span>
                  </div>
                  <div className="detail-item delivery-estimate">
                    <span className="detail-icon">⏱️</span>
                    <span className="detail-text">{offer.deliveryTime} min</span>
                  </div>
                </div>
                
                {/* Restaurant area information - moved above Add to Cart button */}
                <div className="restaurant-area">
                <div className="restaurant-area-info" style={{ 
    marginTop: '10px', 
    marginBottom: '20px', /* Added more space below area info */
    fontSize: '14px', 
    color: '#666', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
                  <span className="area-icon">📍</span>
                  <span className="area-text">{restaurants[offer.restaurant].area}</span>
                </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
                <button 
                  className="offer-button"
                  onClick={() => handleAddToCart(offer)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
            </div>

          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;