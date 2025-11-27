import React, { useState, useRef, useEffect } from 'react';
import './ContactUsPopup.css';

const ContactUsPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agent', text: 'Hello! How can I help you today?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
  if (!isOpen) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Show success message
    setSubmitted(true);
    
    // Reset form after some time if you want
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        topic: '',
        message: ''
      });
    }, 5000); // Reset after 5 seconds
  };

  const toggleLiveChat = () => {
    setShowLiveChat(!showLiveChat);
  };

  const clearChat = () => {
    setChatMessages([
      { sender: 'agent', text: 'Chat history has been cleared. How can I help you today?' }
    ]);
  };

  // Function to get contextual responses based on user input
  const getContextualResponse = (userMessage) => {
    const lowercaseMsg = userMessage.toLowerCase();
    
    // Check for common questions and provide specific responses
    if (lowercaseMsg.includes('delivery') || lowercaseMsg.includes('shipping')) {
      return "Our standard delivery time is 30-45 minutes within city limits. For orders outside the city, it may take up to 90 minutes. Is there anything specific about your delivery you'd like to know?";
    } else if (lowercaseMsg.includes('refund') || lowercaseMsg.includes('money back')) {
      return "We offer refunds for orders within 30 minutes of delivery if there are quality issues. Please provide your order number and we'll process your refund request.";
    } else if (lowercaseMsg.includes('menu') || lowercaseMsg.includes('food')) {
      return "Our menu offers a variety of Indian, Chinese, and Continental dishes. You can view our full menu on our mobile app or website. Would you like me to share the link?";
    } else if (lowercaseMsg.includes('payment') || lowercaseMsg.includes('pay')) {
      return "We accept all major credit/debit cards, UPI payments, and cash on delivery. Did you face any issues with your payment?";
    } else if (lowercaseMsg.includes('cancel') || lowercaseMsg.includes('cancellation')) {
      return "You can cancel your order within 5 minutes of placing it without any charges. After that, cancellation charges may apply depending on the preparation status.";
    } else if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi') || lowercaseMsg.includes('hey')) {
      return "Hello! Welcome to Aahar Express support. How can I assist you today?";
    } else if (lowercaseMsg.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with today?";
    } else if (lowercaseMsg.includes('contact') || lowercaseMsg.includes('phone') || lowercaseMsg.includes('number')) {
      return "You can reach our customer support team at +91 1234567890. Our team is available 24/7 to assist you.";
    } else if (lowercaseMsg.includes('hours') || lowercaseMsg.includes('timing')) {
      return "Our restaurant operates from 10:00 AM to 11:00 PM every day. The last order is accepted at 10:30 PM.";
    } else if (lowercaseMsg.includes('discount') || lowercaseMsg.includes('coupon') || lowercaseMsg.includes('offer')) {
      return "We regularly offer discounts through our mobile app. Currently, you can use code WELCOME20 for a 20% discount on your first order. Would you like to know about any other ongoing offers?";
    } else {
      return "Thank you for your message. I'll connect you with a customer support representative shortly. In the meantime, is there anything specific I can help you with?";
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Add user message
    setChatMessages([...chatMessages, { sender: 'user', text: newMessage }]);
    
    // Store message to use for response
    const userMessage = newMessage;
    setNewMessage('');
    
    // Add typing indicator
    setChatMessages(prevMessages => [
      ...prevMessages, 
      { sender: 'agent', text: '...', isTyping: true }
    ]);
    
    // Simulate agent response after a delay
    setTimeout(() => {
      setChatMessages(prevMessages => {
        // Find and remove the typing indicator
        const messagesWithoutTyping = prevMessages.filter(msg => !msg.isTyping);
        
        // Add the contextual response
        return [
          ...messagesWithoutTyping, 
          { sender: 'agent', text: getContextualResponse(userMessage) }
        ];
      });
    }, 1500);
  };

  return (
    <div className="popup-overlay">
      <div className="contactus-popup">
        <button className="close-btn" onClick={onClose}>✖</button>
        
        <div className="contactus-header">
          <div className="logo-container">
            <span className="logo-emoji">🍱</span>
            <h2>Contact Us</h2>
          </div>
          <p className="tagline">We'd love to hear from you!</p>
        </div>

        <div className="contactus-content">
          {showLiveChat ? (
            <div className="live-chat-container">
              <div className="chat-header">
                <h3>Live Chat</h3>
                <div className="chat-actions">
                  <button className="clear-chat-btn" onClick={clearChat}>Clear Chat</button>
                  <button className="back-btn" onClick={toggleLiveChat}>Back to Contact Options</button>
                </div>
              </div>
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender}-message`}>
                    <div className="message-bubble">
                      {msg.isTyping ? (
                        <div className="typing-indicator">
                          <span></span><span></span><span></span>
                        </div>
                      ) : msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-message-btn">Send</button>
              </form>
            </div>
          ) : (
            <>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div className="contact-details">
                    <h3>Call Us</h3>
                    <p>+91 9866259932</p>
                    <p className="contact-note">Available 24/7 for customer support</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div className="contact-details">
                    <h3>Email Us</h3>
                    <p>aaharexpressindia@gmail.com</p>
                    <p className="contact-note">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="contact-item" onClick={toggleLiveChat}>
                  <span className="contact-icon">💬</span>
                  <div className="contact-details">
                    <h3>Live Chat</h3>
                    <p>Start chatting with our support team</p>
                    <p className="contact-note">Get instant support in real-time</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-form">
                <h3>Send us a message</h3>
                
                {submitted ? (
                  <div className="success-message">
                    <span className="success-icon">✅</span>
                    <h4>Your message sent successfully!</h4>
                    <p>We'll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <select 
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Select Topic</option>
                        <option value="order">Order Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                        <option value="donation">Donation Program</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your Message" 
                        rows="4" 
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUsPopup;