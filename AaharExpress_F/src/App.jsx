import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Popup from './components/Popup';
import About from './components/About';
import Features from './components/Features';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import AccountSettings from './components/AccountSettings';
import RoleBasedRoute from './components/RoleBasedRoute';

import Testimonials from './components/Testimonials';
import SpecialOffers from './components/SpecialOffers';
import Newsletter from './components/Newsletter';

import ForgotPassword from './components/ForgotPassword';
import MenuPage from './components/MenuPage';
import ContactUsPopup from './components/ContactUsPopup';
import FavoritesPage from './components/FavoritesPage';
import './App.css';
import axios from 'axios';
import userService from './services/userService';
import authService from './services/authService';

// Add a PrivateRoute component for protected routes
const PrivateRoute = ({ children }) => {
  console.log('PrivateRoute check');
  const isAuthenticated = authService.isAuthenticated();
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('PrivateRoute - not authenticated, redirecting to home');
    // Also clear any stale user data from localStorage
    authService.logout();
    return <Navigate to="/" replace />;
  }
  
  console.log('PrivateRoute - authenticated, rendering children');
  return children;
};

const App = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Debug user state changes
  useEffect(() => {
    console.log("App - User state changed:", user);
  }, [user]);

  // Migrate user data in localStorage to new format if needed
  useEffect(() => {
    const migrateUserData = () => {
      console.log('Checking if user data needs migration');
      const savedUserStr = localStorage.getItem('user');
      if (savedUserStr) {
        try {
          const savedUser = JSON.parse(savedUserStr);
          let needsMigration = false;
          
          // Check if we need to migrate fields
          if (savedUser.name && !savedUser.fullName) {
            savedUser.fullName = savedUser.name;
            needsMigration = true;
          }
          
          if (savedUser.phone && !savedUser.mobileNumber) {
            savedUser.mobileNumber = savedUser.phone;
            needsMigration = true;
          }
          
          if (!savedUser.memberSince) {
            savedUser.memberSince = savedUser.createdAt || new Date().toISOString();
            needsMigration = true;
          }
          
          // Save migrated data
          if (needsMigration) {
            console.log('Migrating user data to new format');
            localStorage.setItem('user', JSON.stringify(savedUser));
            
            // Update the user state in memory if we're logged in
            if (authService.isAuthenticated()) {
              console.log('Updating in-memory user state with migrated data');
              setUser(savedUser);
            }
          }
        } catch (error) {
          console.error("Error migrating user data:", error);
        }
      }
    };
    
    migrateUserData();
  }, []);

  // Check authentication status and load data from localStorage
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      console.log('App mounted, checking authentication status');
      console.log('Current path:', window.location.pathname);
      
      // Try to load user from localStorage first
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('Found user data in localStorage:', userData.username);
          
          // Ensure the user data has the new field names
          const updatedUserData = {
            ...userData,
            fullName: userData.fullName || userData.name || '',
            mobileNumber: userData.mobileNumber || userData.phone || '',
            address: userData.address || '',
            memberSince: userData.memberSince || userData.createdAt || new Date().toISOString()
          };
          
          // Check if we needed to update any fields
          const needsUpdate = 
            (!userData.fullName && userData.name) || 
            (!userData.mobileNumber && userData.phone) || 
            (!userData.memberSince && userData.createdAt);
            
          if (needsUpdate) {
            console.log('Updating user data with new field names');
            localStorage.setItem('user', JSON.stringify(updatedUserData));
          }
          
          // Set the user state with the updated data
          setUser(updatedUserData);
        } catch (error) {
          console.error("Error parsing saved user:", error);
          // Clear corrupted user data
          localStorage.removeItem('user');
        }
      }
      
      // Check if user is authenticated
      if (authService.isAuthenticated()) {
        try {
          console.log('Token found, verifying and loading user data');
          // Try to get user data from API
          const userData = await userService.getCurrentUser();
          console.log('User data loaded successfully from API:', userData);
          
          // Ensure the API data has all the required fields with proper mapping
          const updatedUserData = {
            ...userData,
            fullName: userData.fullName || userData.name || '',
            mobileNumber: userData.mobileNumber || userData.phone || '',
            address: userData.address || '',
            memberSince: userData.memberSince || userData.createdAt || new Date().toISOString()
          };
          
          setUser(updatedUserData);
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(updatedUserData));
        } catch (error) {
          console.error("Failed to fetch user data from API:", error);
          // If API call fails but we have user data from localStorage, keep using that
          // Do not clear user state here, as it would cause unnecessary re-renders
          // Just keep using the data from localStorage that we've already set above
        }
      } else {
        console.log('No valid authentication found');
        // Clear any stale user data if not authenticated
        if (user) {
          console.log('Clearing user state as not authenticated');
          setUser(null);
        }
      }
      
      // Load other saved data
      loadSavedData();
    };
    
    const loadSavedData = () => {
      // Load cart items
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error parsing saved cart:", error);
          setCartItems([]);
        }
      }
      
      // Load favorites
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error("Error parsing saved favorites:", error);
          setFavorites([]);
        }
      }
      
      // Load favoriteItems for backwards compatibility
      const savedFavoriteIds = localStorage.getItem('favoriteItems');
      if (savedFavoriteIds) {
        try {
          localStorage.setItem('favoriteItems', savedFavoriteIds);
        } catch (error) {
          console.error("Error handling saved favorite IDs:", error);
        }
      }
      
      // Load orders
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (error) {
          console.error("Error parsing saved orders:", error);
          setOrders([]);
        }
      }
      
      // Load dark mode preference
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
      if (savedDarkMode) {
        document.body.classList.add('dark-mode');
      }
    };

    checkAuthAndLoadData();
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Also update favoriteItems for backwards compatibility with your current FavoritesPage
    const favoriteIds = favorites.map(item => item.id);
    localStorage.setItem('favoriteItems', JSON.stringify(favoriteIds));
  }, [favorites]);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem => 
        cartItem.id === item.id ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem
      ));
    } else {
      setCartItems([...cartItems, {...item, quantity: 1}]);
    }
    
    // Show cart feedback
    setIsCartOpen(true);
    setTimeout(() => setIsCartOpen(false), 3000);
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === itemId ? {...item, quantity: newQuantity} : item
    ));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };
  
  // Favorites functionality
  const handleAddToFavorites = (item) => {
    if (!favorites.some(favorite => favorite.id === item.id)) {
      setFavorites([...favorites, item]);
    }
  };
  
  const handleRemoveFromFavorites = (itemId) => {
    setFavorites(favorites.filter(item => item.id !== itemId));
  };
  
  const isItemFavorite = (itemId) => {
    return favorites.some(item => item.id === itemId);
  };

  const handleCheckout = (shippingDetails) => {
    const newOrder = {
      id: `order-${Date.now()}`,
      items: [...cartItems],
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'processing',
      timestamp: new Date().toISOString(), // Store as ISO string for consistent formatting
      shippingDetails,
      estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    setActiveOrder(newOrder);
    handleClearCart();
    return newOrder;
  };
  
  const handleLogin = async (username, password) => {
    try {
      console.log('Login attempt for:', username);
      // Step 1: Use authService for login to get token
      const response = await authService.login(username, password);
      console.log('Login successful, response:', response);

      try {
        // Step 2: Fetch detailed user data using the username
        console.log('Fetching user details for:', response.username || username);
        const userData = await userService.fetchUserAfterLogin(response.username || username);
        console.log('User details fetched successfully:', userData);
        
        // Step 3: Set the user data in state and localStorage
        setUser(userData);
        
        // Step 4: Close the auth modal
        setIsAuthModalOpen(false);
        
        // Step 5: Show success message and redirect to dashboard instead of home
        console.log('Authentication complete, redirecting to dashboard');
        
        // Force immediate redirect to dashboard - using direct DOM approach for reliability
        window.location.href = '/dashboard';
      } catch (userError) {
        console.error("Error fetching user details:", userError);
        
        // Even if we couldn't get detailed user info, we can still use basic info from login response
        if (response && response.username) {
          const basicUserData = {
            id: response.id || 0,
            username: response.username,
            email: response.email || '',
            fullName: response.fullName || '',
            mobileNumber: response.mobileNumber || '',
            address: response.address || '',
            memberSince: response.memberSince || new Date().toISOString(),
            roles: response.roles || ['ROLE_USER']
          };
          
          console.log('Using basic user data from login response:', basicUserData);
          setUser(basicUserData);
          localStorage.setItem('user', JSON.stringify(basicUserData));
          
          // Close the auth modal and redirect to dashboard
          setIsAuthModalOpen(false);
          window.location.href = '/dashboard';
        } else {
          alert("Login successful but couldn't fetch user details. Please try refreshing the page.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your username and password.");
    }
  };

  const handleLogout = () => {
    console.log("App - Logout called");
    // Display a confirmation dialog before logging out
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      // Use authService for logout
      authService.logout();
      setUser(null);
      console.log("App - User set to null, redirecting to home");
      window.location.href = '/';
    }
  };

  const handlePasswordReset = async (email) => {
    try {
      await authService.forgotPassword(email);
      alert("A temporary password has been sent to your email address.");
      setIsPasswordResetOpen(false);
      setIsAuthModalOpen(true); // Return to login page
    } catch (error) {
      console.error("Password reset failed:", error);
      alert("Password reset failed. Please try again.");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Handle Contact popup
  const handleContactPopup = () => {
    setIsContactPopupOpen(true);
  };

  // Handle viewing an order
  const handleViewOrder = (order) => {
    setActiveOrder(order);
  };

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <Navbar 
          onOrderClick={() => setIsPopupOpen(true)} 
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          favoriteCount={favorites.length}
          onCartClick={() => setIsCartOpen(!isCartOpen)}
          onAuthClick={() => setIsAuthModalOpen(true)}
          onContactClick={handleContactPopup}
          user={user}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <>
                <Hero user={user} />
                <SpecialOffers 
                  onAddToCart={handleAddToCart} 
                  onAddToFavorites={handleAddToFavorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                  isItemFavorite={isItemFavorite}
                />
                <Features />
                <Testimonials />
                <Newsletter />
              </>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={
              <MenuPage 
                onAddToCart={handleAddToCart}
                onAddToFavorites={handleAddToFavorites}
                onRemoveFromFavorites={handleRemoveFromFavorites}
                isItemFavorite={isItemFavorite}
                filterCategory={filterCategory}
              />
            } />
            
            {/* Regular dashboard - will show appropriate role dashboard based on user role */}
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            
            
            {/* Role-specific dashboard routes */}
            <Route path="/admin-dashboard" element={
              <RoleBasedRoute roles="ADMIN" redirectTo="/">
                <Dashboard user={user} />
              </RoleBasedRoute>
            } />
            
            <Route path="/restaurant-dashboard" element={
              <RoleBasedRoute roles="RESTAURANT" redirectTo="/">
                <Dashboard user={user} />
              </RoleBasedRoute>
            } />
            
            <Route path="/customer-dashboard" element={
              <RoleBasedRoute roles="CUSTOMER" redirectTo="/">
                <Dashboard user={user} />
              </RoleBasedRoute>
            } />
            
            <Route path="/delivery-dashboard" element={
              <RoleBasedRoute roles={["DELIVERY_AGENT", "DELIVERY"]} redirectTo="/">
                <Dashboard user={user} />
              </RoleBasedRoute>
            } />
            
            <Route path="/favorites" element={
              <PrivateRoute>
                <FavoritesPage 
                  favorites={favorites}
                  onRemoveFavorite={handleRemoveFromFavorites}
                  onAddToCart={handleAddToCart}
                />
              </PrivateRoute>
            } />
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout 
                  cartItems={cartItems} 
                  onCheckout={handleCheckout}
                  onQuantityChange={handleQuantityChange}
                  onRemoveItem={handleRemoveFromCart}
                  user={user}
                />
              </PrivateRoute>
            } />
            <Route path="/tracking" element={
              <PrivateRoute>
                <OrderTracking 
                  order={activeOrder} 
                  onBackToHome={() => setActiveOrder(null)} 
                />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <UserProfile 
                  user={user} 
                  orders={orders} 
                  onViewOrder={handleViewOrder} 
                />
              </PrivateRoute>
            } />
            <Route path="/account-settings" element={
              <PrivateRoute>
                <AccountSettings 
                  user={user}
                  onUpdateUser={(updatedUser) => setUser(updatedUser)}
                />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        
        <Footer />
        
        <Popup 
          isOpen={isPopupOpen} 
          onClose={() => setIsPopupOpen(false)} 
          cartItems={cartItems}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveFromCart}
          onForgotPassword={() => {
            setIsPopupOpen(false);
            setIsPasswordResetOpen(true);
          }}
          onCheckout={() => {
            setIsPopupOpen(false);
            // Navigate to checkout page
          }}
          onLogin={handleLogin}
        />

        <Cart 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={() => {
            setIsCartOpen(false);
            // Navigate to checkout page
          }}
        />

        <ForgotPassword
          isOpen={isPasswordResetOpen}
          onClose={() => setIsPasswordResetOpen(false)}
          onBackToSignIn={() => {
            setIsPasswordResetOpen(false);
            setIsAuthModalOpen(true);
          }}
        />
        
        <ContactUsPopup
          isOpen={isContactPopupOpen}
          onClose={() => setIsContactPopupOpen(false)}
        />
      </div>
    </Router>
  );
};

export default App;