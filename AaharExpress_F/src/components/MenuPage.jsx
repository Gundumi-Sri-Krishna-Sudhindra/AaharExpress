import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Cart from './Cart';
import './MenuPage.css';

// Import all the image assets
import tandooriChickenImg from '../assets/tandooriChickenImg.webp';
import samosaImg from '../assets/samosaImg.webp';
import paneertikka from '../assets/paneertikka.webp';
import butterchicken from '../assets/butterChickenImg.webp';
import palakpaneer from '../assets/palakPaneerImg.webp';
import chickenbriyani from '../assets/ChickenbriyaniImg.webp';
import dalmakhani from '../assets/dalmakhani.webp';
import cholebhature from '../assets/cholebhature.webp';
import masaladosa from '../assets/masalaDosaImg.webp';
import naan from '../assets/naanImg.webp';
import garlicnaan from '../assets/garlicnaan.webp';
import jeerarice from '../assets/jeerarice.webp';
import gulabjamun from '../assets/gulabJamunImg.webp';
import rasamalai from '../assets/rasmalaiImg.webp';
import ricekheer from '../assets/ricekheer.webp';
import mangolassi from '../assets/mangoLassiImg.webp';
import masalachai from '../assets/masalachai.webp';
import idlysambar from '../assets/idlysambar.webp';
import meduvada from '../assets/meduvada.webp';
import filtercoffee from '../assets/filtercoffee.webp';
import vegfriedrice from '../assets/vegfriedrice.webp';
// Additional imports from the original code
import hyderabadiBiryaniImg from '../assets/hyderabadiBiryaniImg.webp';
import chickenTikkaImg from '../assets/chickenTikkaImg.webp';
import butterNaanImg from '../assets/butterNaanImg.webp';
import dalMakhaniImg from '../assets/dalMakhaniImg.webp';
import paneerButterMasalaImg from '../assets/paneerButterMasalaImg.webp';
import vegSchezwanFriedRiceImg from '../assets/vegSchezwanFriedRiceImg.webp';
import chickenRollImg from '../assets/chickenRollImg.webp';
import paneerWrapImg from '../assets/paneerWrapImg.webp';
import belgianWaffleImg from '../assets/belgianWaffleImg.webp';
import chocolateBrownieImg from '../assets/chocolateBrownieImg.webp';
import pistaKulfiImg from '../assets/pistaKulfiImg.webp';
import paneerDosaImg from '../assets/paneerDosaImg.webp';
import idliSambarImg from '../assets/idliSambarImg.webp';
import vegPulaoImg from '../assets/vegPulaoImg.webp';
import butterchickencombo from '../assets/butterchickencombo.webp';
import maharajathali from '../assets/maharajathali.webp';
import southindianfeast from '../assets/southindianfeast.webp';
import streetfoodplatter from '../assets/streetfoodplatter.webp';
import chillscoopsdelight from '../assets/chillscoopsdelight.webp';
import wrapbitecombo from '../assets/wrapbitecombo.webp'
const MenuPage = () => {
  // State management
  const [activeRestaurant, setActiveRestaurant] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartNotification, setCartNotification] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);
  
  // Restaurant data
  const restaurants = [
    { id: 'all', name: 'All Restaurants' },
    { id: 'punjab-palace', name: 'Punjab Palace', area: 'Koramangala', deliveryTime: '30-40 min', servingCapacity: 'Serves 2-4 people per dish', rating: 4.6 },
    { id: 'south-spice', name: 'South Spice', area: 'Indiranagar', deliveryTime: '25-35 min', servingCapacity: 'Serves 1-3 people per dish', rating: 4.4 },
    { id: 'mumbai-street', name: 'Mumbai Street Food', area: 'HSR Layout', deliveryTime: '35-45 min', servingCapacity: 'Serves 1-2 people per dish', rating: 4.3 },
    { id: 'cross-roads', name: 'Cross Roads', area: 'Kothapet', deliveryTime: '25-40 min', servingCapacity: 'Serves 2-3 people per dish', rating: 4.2 },
    { id: 'spice-haven', name: 'Spice Haven', area: 'Banjara Hills', deliveryTime: '30-45 min', servingCapacity: 'Serves 2-3 people per dish', rating: 4.5 },
    { id: 'royal-biryani', name: 'Royal Biryani House', area: 'Madhapur', deliveryTime: '35-50 min', servingCapacity: 'Serves 3-4 people per dish', rating: 4.6 },
    { id: 'tandoori-flames', name: 'Tandoori Flames', area: 'Jubilee Hills', deliveryTime: '25-40 min', servingCapacity: 'Serves 2-3 people per dish', rating: 4.3 },
    { id: 'curry-palace', name: 'Curry Palace', area: 'Gachibowli', deliveryTime: '30-45 min', servingCapacity: 'Serves 2-3 people per dish', rating: 4.4 },
    { id: 'dosa-express', name: 'Dosa Express', area: 'Ameerpet', deliveryTime: '20-35 min', servingCapacity: 'Serves 1-2 people per dish', rating: 4.1 },
    { id: 'spicy-delight', name: 'Spicy Delight', area: 'Kukatpally', deliveryTime: '40-55 min', servingCapacity: 'Serves 3-4 people per dish', rating: 4.2 },
    { id: 'chill-scoops', name: 'Chill Scoops', area: 'Himayat Nagar', deliveryTime: '15-30 min', servingCapacity: 'Serves 1-2 people per dish', rating: 4.5 },
    { id: 'wrap-n-bites', name: 'Wrap & Bites', area: 'Punjagutta', deliveryTime: '20-35 min', servingCapacity: 'Serves 1-3 people per dish', rating: 4.3 },
    { id: 'spicy-curry-hut', name: 'Spicy Curry Hut', area: 'Begumpet', deliveryTime: '30-45 min', servingCapacity: 'Serves 2-3 people per dish', rating: 4.4 },
    { id: 'naan-mahal', name: 'Naan Mahal', area: 'Secunderabad', deliveryTime: '35-50 min', servingCapacity: 'Serves 2-4 people per dish', rating: 4.2 },
  ];
  
  // Categories
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'starters', name: 'Starters' },
    { id: 'main-course', name: 'Main Course' },
    { id: 'breads', name: 'Breads' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'rolls & sandwiches', name: 'Rolls & Sandwiches' },
    { id: 'beverages', name: 'Beverages' },
  ];
 

  
  // Menu items (first few shown, rest included but abbreviated in code)
  const menuItems = [
    // Original menu items
    { id: 'tandoori-chicken', name: 'Tandoori Chicken', description: 'Chicken marinated in yogurt and spices, cooked in a tandoor', price: 320, category: 'starters', restaurant: 'punjab-palace', image: tandooriChickenImg, isVeg: false, isSpicy: true, bestSeller: true, rating: 4.8, servingSize: 'Serves 2-3', quantity: '4 pieces/500g' },
    { id: 'samosa', name: 'Vegetable Samosa', description: 'Crispy pastry filled with spiced potatoes and peas', price: 80, category: 'starters', restaurant: 'mumbai-street', image: samosaImg, isVeg: true, isSpicy: false, bestSeller: true, rating: 4.5, servingSize: 'Serves 1-2', quantity: '2 pieces' },
    { id: 'paneer-tikka', name: 'Paneer Tikka', description: 'Chunks of paneer marinated in spices and grilled', price: 220, category: 'starters', restaurant: 'punjab-palace', image: paneertikka, isVeg: true, isSpicy: false, rating: 4.2, servingSize: 'Serves 2', quantity: '8 pieces/250g' },
    { id: 'butter-chicken', name: 'Butter Chicken', description: 'Tender chicken in a rich and creamy tomato sauce', price: 350, category: 'main-course', restaurant: 'punjab-palace', image: butterchicken, isVeg: false, isSpicy: false, bestSeller: true, rating: 4.9, servingSize: 'Serves 2-3', quantity: '350g' },
    { id: 'palak-paneer', name: 'Palak Paneer', description: 'Cottage cheese cubes in a spinach gravy', price: 280, category: 'main-course', restaurant: 'punjab-palace', image: palakpaneer, isVeg: true, isSpicy: false, rating: 4.3, servingSize: 'Serves 2', quantity: '300g' },
    { id: 'chicken-biryani', name: 'Chicken Biryani', description: 'Fragrant rice cooked with chicken and aromatic spices', price: 320, category: 'main-course', restaurant: 'punjab-palace', image: chickenbriyani, isVeg: false, isSpicy: true, bestSeller: true, rating: 4.7, servingSize: 'Serves 2-3', quantity: '500g' },
    { id: 'dal-makhani', name: 'Dal Makhani', description: 'Black lentils slow-cooked with butter and cream', price: 240, category: 'main-course', restaurant: 'punjab-palace', image: dalmakhani, isVeg: true, isSpicy: false, rating: 4.4, servingSize: 'Serves 2', quantity: '250g' },
    { id: 'chole-bhature', name: 'Chole Bhature', description: 'Spicy chickpea curry served with deep-fried bread', price: 180, category: 'main-course', restaurant: 'mumbai-street', image: cholebhature, isVeg: true, isSpicy: true, rating: 4.6, servingSize: 'Serves 1-2', quantity: '2 bhature, 200g chole' },
    { id: 'masala-dosa', name: 'Masala Dosa', description: 'Crispy fermented crepe filled with spiced potatoes', price: 150, category: 'breakfast', restaurant: 'south-spice', image: masaladosa, isVeg: true, isSpicy: false, rating: 4.5, servingSize: 'Serves 1', quantity: '1 piece' },
    { id: 'vegfried-rice', name: 'Vegfried Rice', description: 'Basmati rice is stir-fried rice with vegetables and seasonings', price: 120, category: 'main-course', restaurant: 'punjab-palace', image: vegfriedrice, isVeg: true, isSpicy: false, bestSeller: true, rating: 4.6, servingSize: 'Serves 1', quantity: '200g' },
    { id: 'naan', name: 'Butter Naan', description: 'Soft leavened bread baked in tandoor, finished with butter', price: 60, category: 'breads', restaurant: 'punjab-palace', image: naan, isVeg: true, isSpicy: false, rating: 4.1, servingSize: 'Serves 1', quantity: '1 piece' },
    { id: 'garlic-naan', name: 'Garlic Naan', description: 'Naan bread topped with garlic and herbs', price: 70, category: 'breads', restaurant: 'punjab-palace', image: garlicnaan, isVeg: true, isSpicy: false, rating: 4.3, servingSize: 'Serves 1', quantity: '1 piece' },
    { id: 'jeera-rice', name: 'Jeera Rice', description: 'Basmati rice tempered with cumin seeds', price: 120, category: 'main-course', restaurant: 'punjab-palace', image: jeerarice, isVeg: true, isSpicy: false, rating: 4.0, servingSize: 'Serves 2', quantity: '250g' },
    { id: 'gulab-jamun', name: 'Gulab Jamun', description: 'Deep-fried milk solids soaked in sugar syrup', price: 100, category: 'desserts', restaurant: 'mumbai-street', image: gulabjamun, isVeg: true, isSpicy: false, bestSeller: true, rating: 4.8, servingSize: 'Serves 2', quantity: '4 pieces' },
    { id: 'rasmalai', name: 'Rasmalai', description: 'Soft cottage cheese dumplings in sweetened milk', price: 120, category: 'desserts', restaurant: 'punjab-palace', image: rasamalai, isVeg: true, isSpicy: false, rating: 4.7, servingSize: 'Serves 2', quantity: '3 pieces' },
    { id: 'kheer', name: 'Rice Kheer', description: 'Rice pudding made with milk, sugar, and nuts', price: 90, category: 'desserts', restaurant: 'punjab-palace', image: ricekheer, isVeg: true, isSpicy: false, rating: 4.2, servingSize: 'Serves 2', quantity: '150g' },
    { id: 'mango-lassi', name: 'Mango Lassi', description: 'Refreshing yogurt drink blended with mango', price: 80, category: 'beverages', restaurant: 'punjab-palace', image: mangolassi, isVeg: true, isSpicy: false, rating: 4.6, servingSize: 'Serves 1', quantity: '300ml' },
    { id: 'masala-chai', name: 'Masala Chai', description: 'Spiced tea with milk', price: 50, category: 'beverages', restaurant: 'mumbai-street', image: masalachai, isVeg: true, isSpicy: false, rating: 4.4, servingSize: 'Serves 1', quantity: '150ml' },
    { id: 'idli-sambar1', name: 'Idli Sambar', description: 'Steamed rice cakes served with lentil soup', price: 120, category: 'breakfast', restaurant: 'south-spice', image: idlysambar, isVeg: true, isSpicy: false, bestSeller: true, rating: 4.5, servingSize: 'Serves 1-2', quantity: '4 idlis, 150ml sambar' },
    { id: 'vada', name: 'Medu Vada', description: 'Savory fried snack made from urad dal', price: 100, category: 'starters', restaurant: 'south-spice', image: meduvada, isVeg: true, isSpicy: false, rating: 4.3, servingSize: 'Serves 1-2', quantity: '3 pieces' },
    { id: 'filter-coffee', name: 'Filter Coffee', description: 'Traditional South Indian coffee with frothy milk', price: 60, category: 'beverages', restaurant: 'south-spice', image: filtercoffee, isVeg: true, isSpicy: false, bestSeller: true, rating: 4.7, servingSize: 'Serves 1', quantity: '120ml' },
    { id: 'royal-hyderabadi-biryani', name: 'Hyderabadi Biryani', description: 'Authentic Hyderabadi biryani made with fragrant basmati rice and slow-cooked marinated meat.', price: 450, category: 'main-course', restaurant: 'royal-biryani', image: hyderabadiBiryaniImg, isVeg: false, isSpicy: true, bestSeller: true, rating: 4.7, servingSize: 'Serves 2-3', quantity: '1 full plate' },
    { id: 'chicken-tikka', name: 'Chicken Tikka', description: 'Tender chicken pieces marinated in yogurt and grilled to perfection.', price: 320, category: 'starters', restaurant: 'tandoori-flames', image: chickenTikkaImg, isVeg: false, isSpicy: true, bestSeller: true, rating: 4.8, servingSize: 'Serves 2-3', quantity: '6 pieces' },
    { id: 'butter-naan', name: 'Butter Naan', description: 'Soft and fluffy naan brushed with butter, perfect with any curry.', price: 60, category: 'breads', restaurant: 'naan-mahal', image: butterNaanImg, isVeg: true, isSpicy: false, bestSeller: false, rating: 4.5, servingSize: 'Serves 1-2', quantity: '2 pieces' },
    { id: 'dal-makhani1', name: 'Dal Makhani', description: 'Slow-cooked black lentils in a creamy, buttery gravy, rich in flavor.', price: 280, category: 'main-course', restaurant: 'curry-palace', image: dalMakhaniImg, isVeg: true, isSpicy: false, bestSeller: true, rating: 4.6, servingSize: 'Serves 2', quantity: '1 bowl' },
    { id: 'paneer-butter-masala', name: 'Paneer Butter Masala', description: 'Soft paneer cubes in a rich and creamy tomato-based curry.', price: 320, category: 'main-course', restaurant: 'spicy-curry-hut', image: paneerButterMasalaImg, isVeg: true, isSpicy: false, bestSeller: false, rating: 4.4, servingSize: 'Serves 2-3', quantity: '1 bowl' },
    { id: 'veg-schezwan-fried-rice', name: 'Veg Schezwan Fried Rice', description: 'Spicy fried rice tossed with fresh vegetables and Schezwan sauce.', price: 220, category: 'main-course', restaurant: 'spicy-curry-hut', image: vegSchezwanFriedRiceImg, isVeg: true, isSpicy: true, bestSeller: false, rating: 4.4, servingSize: 'Serves 1-2', quantity: '1 full plate' },
    { id: 'chicken-roll', name: 'Chicken Kathi Roll', description: 'Spiced chicken wrapped in a soft paratha with onions and chutney.', price: 180, category: 'rolls & sandwiches', restaurant: 'wrap-n-bites', image: chickenRollImg, isVeg: false, isSpicy: true, bestSeller: true, rating: 4.5, servingSize: 'Serves 1', quantity: '1 roll' },
    { id: 'paneer-wrap', name: 'Paneer Wrap', description: 'Grilled paneer wrapped in a soft tortilla with fresh veggies and sauces.', price: 170, category: 'rolls & sandwiches', restaurant: 'wrap-n-bites', image: paneerWrapImg, isVeg: true, isSpicy: false, bestSeller: false, rating: 4.3, servingSize: 'Serves 1', quantity: '1 wrap' },
    { id: 'belgian-waffle', name: 'Classic Belgian Waffle', description: 'Golden crispy waffle topped with maple syrup and fresh fruits.', price: 180, category: 'desserts', restaurant: 'chill-scoops', image: belgianWaffleImg, isVeg: true, isSpicy: false, bestSeller: true, rating: 4.7, servingSize: 'Serves 1', quantity: '1 waffle' },
    { id: 'chocolate-brownie', name: 'Chocolate Brownie', description: 'Rich and fudgy chocolate brownie served with vanilla ice cream.', price: 200, category: 'desserts', restaurant: 'chill-scoops', image: chocolateBrownieImg, isVeg: true, isSpicy: false, bestSeller: true, rating: 4.8, servingSize: 'Serves 1-2', quantity: '1 piece' },
    { id: 'pista-kulfi', name: 'Pista Kulfi', description: 'Traditional Indian ice cream made with pistachios and saffron.', price: 120, category: 'desserts', restaurant: 'chill-scoops', image: pistaKulfiImg, isVeg: true, isSpicy: false, bestSeller: false, rating: 4.6, servingSize: 'Serves 1', quantity: '1 stick' },
    { id: 'paneer-dosa', name: 'Paneer Dosa', description: 'Crispy South Indian dosa filled with spicy paneer stuff, served with chutney and sambar.', price: 180, category: 'breakfast', restaurant: 'dosa-express', image: paneerDosaImg, isVeg: true, isSpicy: true, bestSeller: true, rating: 4.6, servingSize: 'Serves 1', quantity: '1 dosa' },
    { id: 'idli-sambar', name: 'Idli Sambar', description: 'Soft steamed idlis served with hot sambar and coconut chutney.', price: 140, category: 'breakfast', restaurant: 'dosa-express', image: idliSambarImg, isVeg: true, isSpicy: false, bestSeller: false, rating: 4.4, servingSize: 'Serves 1', quantity: '4 pieces' },
    { id: 'veg-pulao', name: 'Veg Pulao', description: 'Aromatic rice dish cooked with mixed vegetables and mild spices.', price: 240, category: 'main-course', restaurant: 'curry-palace', image: vegPulaoImg, isVeg: true, isSpicy: false, bestSeller: false, rating: 4.3, servingSize: 'Serves 2', quantity: '1 plate' },
    
    // Adding special offer items to the menu with special label
    { id: 'offer-butter-chicken', name: 'Butter Chicken Combo', description: 'Creamy butter chicken with garlic naan and jeera rice', price: 360, originalPrice: 450, discount: '20%', category: 'main-course', restaurant: 'punjab-palace', image: butterchickencombo, isVeg: false, isSpicy: false, bestSeller: true, rating: 4.8, servingSize: '2 people', quantity: '1 combo', deliveryTime: '30-40', isSpecialOffer: true },
    { id: 'offer-thali', name: 'Maharaja Thali', description: 'Complete meal with 2 curries, dal, rice, bread, dessert and papad', price: 440, originalPrice: 550, discount: '20%', category: 'main-course', restaurant: 'curry-palace', image: maharajathali, isVeg: true, isSpicy: false, bestSeller: true, rating: 4.7, servingSize: '1-2 people', quantity: '1 thali', deliveryTime: '35-45', isSpecialOffer: true },
    { id: 'offer-south-combo', name: 'South Indian Feast', description: 'Masala dosa, idli, vada with sambar and chutney', price: 299, originalPrice: 380, discount: '21%', category: 'breakfast', restaurant: 'south-spice', image: southindianfeast, isVeg: true, isSpicy: true, bestSeller: true, rating: 4.6, servingSize: 'Serves 2 ', quantity: '1 feast', deliveryTime: '25-35', isSpecialOffer: true },
    { id: 'offer-street-food', name: 'Street Food Platter', description: 'Selection of pani puri, bhel puri, pav bhaji and samosa', price: 280, originalPrice: 350, discount: '20%', category: 'starters', restaurant: 'mumbai-street', image: streetfoodplatter, isVeg: true, isSpicy: true, bestSeller: true, rating: 4.5, servingSize: 'Serves 3-4', quantity: '1 platter', deliveryTime: '20-30', isSpecialOffer: true },
    { id: 'chill-scoops-delight', name: 'Ice Cream Combo', description: 'A delightful mix of chocolate, vanilla, and strawberry scoops topped with nuts and syrup', price: 240, originalPrice: 300, discount: '20%', category: 'desserts', restaurant: 'chill-scoops', image: chillscoopsdelight, isVeg: true, isSpicy: false, bestSeller: false, rating: 4.6, servingSize: 'Serves 1-2', quantity: '1 combo', deliveryTime: '15-30', isSpecialOffer: true },
    
   { id: 'wrap-bites-combo', name: 'Wrap & Bites Combo', description: 'A delightful combo featuring Paneer Sandwich, Paneer Pizza, Veg Burger, and Veg Bites', price: 525, originalPrice: 700, discount: '25%', category: 'rolls & sandwiches', restaurant: 'wrap-n-bites',   image: wrapbitecombo, isVeg: true,  isSpicy: false, bestSeller : true, rating: 4.4, servingSize: 'Serves 1-3 ',  quantity: '1 combo', deliveryTime: '20-35 ', isSpecialOffer: true}
    
  ];

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteItems');
    if (savedFavorites) {
      setFavoriteItems(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
  }, [favoriteItems]);
  useEffect(() => {
    // Save menu items and restaurants to localStorage for favorites page to use
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    localStorage.setItem('restaurants', JSON.stringify(restaurants));
  }, []);

  // Reset category when restaurant changes
  useEffect(() => {
    setActiveCategory('all');
  }, [activeRestaurant]);

// Filter items based on active restaurant, category, and search term
const filteredItems = menuItems.filter(item => {
  // Filter by restaurant
  const matchesRestaurant = activeRestaurant === 'all' || item.restaurant === activeRestaurant;
  
  // Filter by category
  const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
  
  // Filter by search term
  const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchTerm.toLowerCase());
  
  return matchesRestaurant && matchesCategory && matchesSearch;
});

// Toggle favorite status of an item
const toggleFavorite = (itemId) => {
  if (favoriteItems.includes(itemId)) {
    // Remove from favorites
    setFavoriteItems(favoriteItems.filter(id => id !== itemId));
  } else {
    // Add to favorites
    setFavoriteItems([...favoriteItems, itemId]);
  }
};

// Check if an item is in favorites
const isFavorite = (itemId) => {
  return favoriteItems.includes(itemId);
};

// Cart functions
const handleAddToCart = (item) => {
  // Check if item already exists in cart
  const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
  
  if (existingItemIndex >= 0) {
    // Item exists, increment quantity
    const updatedCartItems = [...cartItems];
    updatedCartItems[existingItemIndex] = {
      ...updatedCartItems[existingItemIndex],
      quantity: updatedCartItems[existingItemIndex].quantity + 1
    };
    setCartItems(updatedCartItems);
  } else {
    // Item doesn't exist, add with quantity 1
    setCartItems([...cartItems, { ...item, quantity: 1 }]);
  }
  
  // Show notification
  setCartNotification(true);
  setTimeout(() => {
    setCartNotification(false);
  }, 2000);
  
  // Optionally open cart after adding
  setIsCartOpen(true);
};

const handleQuantityChange = (itemId, newQuantity) => {
  if (newQuantity <= 0) {
    // Remove item if quantity is 0 or less
    handleRemoveItem(itemId);
    return;
  }

  const updatedCartItems = cartItems.map(item => 
    item.id === itemId ? { ...item, quantity: newQuantity } : item
  );
  setCartItems(updatedCartItems);
};

const handleRemoveItem = (itemId) => {
  const updatedCartItems = cartItems.filter(item => item.id !== itemId);
  setCartItems(updatedCartItems);
};

const handleCheckout = () => {
  // Checkout logic will be implemented by the Cart component
  console.log('Proceeding to checkout with items:', cartItems);
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

// Get the current restaurant object if one is selected
const currentRestaurant = activeRestaurant !== 'all' 
  ? restaurants.find(r => r.id === activeRestaurant) 
  : null;

return (
  <div className="menu-page">
    <Navbar 
      cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
      onCartClick={() => setIsCartOpen(true)}
      favoriteCount={favoriteItems.length}
    />
    
    <div className="menu-header">
      <div className="container">
        <h1>Our Menu</h1>
        <p>Discover authentic Indian flavors from South to North</p>
        
        <div className="search-filter-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="search-icon">🔍</div>
          </div>
          
          <div className="filter-options">
            <div className="filter-label">Restaurants:</div>
            <div className="filter-tags">
              {restaurants.map(restaurant => (
                <button
                  key={restaurant.id}
                  className={`filter-tag ${activeRestaurant === restaurant.id ? 'active' : ''}`}
                  onClick={() => setActiveRestaurant(restaurant.id)}
                >
                  {restaurant.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-options mt-3">
            <div className="filter-label">Categories:</div>
            <div className="filter-tags">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`filter-tag ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="menu-container container" style={{ marginTop: '30px' }}>
      {currentRestaurant && (
        <div className="restaurant-info">
          <h2>{currentRestaurant.name}</h2>
          <div className="restaurant-details">
            <div className="restaurant-rating">
              {renderRatingStars(currentRestaurant.rating)}
            </div>
            <div className="restaurant-area">
              <span className="info-icon">📍</span>
              <span className="info-label">Area:</span> 
              <span className="info-value">{currentRestaurant.area}</span>
            </div>
            <div className="restaurant-delivery">
              <span className="info-icon">⏱️</span>
              <span className="info-label">Delivery Time:</span> 
              <span className="info-value">{currentRestaurant.deliveryTime}</span>
            </div>
            <div className="restaurant-serving">
              <span className="info-icon">👥</span>
              <span className="info-label">Capacity:</span> 
              <span className="info-value">{currentRestaurant.servingCapacity}</span>
            </div>
            <p>{filteredItems.length} items available</p>
          </div>
        </div>
      )}
      
      {filteredItems.length > 0 ? (
        <div className="menu-grid">
          {filteredItems.map(item => (
            <div className="menu-item" key={item.id}>
              <div className="menu-item-image">
                <img src={item.image || '/api/placeholder/400/300'} alt={item.name} />
                {item.bestSeller && <div className="bestseller-tag">Bestseller</div>}
                <div className="restaurant-tag">
                  {restaurants.find(r => r.id === item.restaurant).name}
                </div>
                <button 
                  className={`favorite-button ${isFavorite(item.id) ? 'favorited' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  title={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
                  aria-label={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: isFavorite(item.id) ? 'rgba(255, 107, 107, 0.9)' : 'rgba(255, 255, 255, 0.8)',
                    color: isFavorite(item.id) ? 'white' : 'inherit',
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
                  {isFavorite(item.id) ? '❤️' : '🤍'}
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
        {restaurants.find(r => r.id === item.restaurant).deliveryTime}
      </span>
    </div>
  </div>
  
  {/* Added area information with more spacing */}
  <div className="restaurant-area-info" style={{ 
    marginTop: '10px', 
    marginBottom: '20px', /* Added more space below area info */
    fontSize: '14px', 
    color: '#666', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }}>
    <span className="detail-icon">📍</span>
    <span className="detail-text">
      {restaurants.find(r => r.id === item.restaurant).area}
    </span>
  </div>
  
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
    <button 
      className="add-to-cart-btn"
      onClick={() => handleAddToCart(item)}
    >
      Add to Cart
    </button>
  </div>
</div>
            </div>
            

          ))}
        </div>
      ) : (
        <div className="no-items-found">
          <div className="no-items-icon">🍽️</div>
          <h3>No dishes found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
    
    {/* Cart Component */}
    <Cart 
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      cartItems={cartItems}
      onQuantityChange={handleQuantityChange}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
    />
    
    {cartNotification && (
      <div className="cart-notification">
        Item added to cart
      </div>
    )}
  </div>
);
};

export default MenuPage;