import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Your food delivered in 30 minutes or less, guaranteed fresh and hot.'
    },
    {
      icon: '🍽️',
      title: 'Fresh Food',
      description: 'Made with quality ingredients sourced from local farmers and producers.'
    },
    {
      icon: '💳',
      title: 'Easy Payment',
      description: 'Multiple secure payment options including credit card, PayPal, and cash.'
    },
    {
      icon: '🌿',
      title: 'Eco-Friendly',
      description: 'Sustainable packaging and eco-conscious practices to reduce our carbon footprint.'
    }
  ];

  return (
    <section className="features-section section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Experience the difference with our service</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;