import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Testimonials.css';
import person1 from '../assets/person1.webp';
import person2 from '../assets/person2.webp';
import person3 from '../assets/person3.webp';
import person4 from '../assets/person4.webp';
import person5 from '../assets/person5.webp';
import person6 from '../assets/person6.webp';
import person7 from '../assets/person7.webp';
import person8 from '../assets/person8.webp';
const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  
  const testimonials = [
    {
      id: 1,
      name: 'Priya Venkatesh',
      position: 'Food Blogger',
      image: person1, // Placeholder for Chennai Marina Beach
      content: 'AaharExpress has completely transformed how I enjoy restaurant meals at home. The delivery is always on time, and the food arrives hot and fresh as if I was dining in the restaurant!',
      rating: 5,
      location: 'Chennai',
      date: 'March 10, 2025'
    },
    {
      id: 2,
      name: 'Karthik Subramanian',
      position: 'Tech Entrepreneur',
      image: person2, // Placeholder for Bangalore Cubbon Park
      content: 'As someone with a busy schedule, AaharExpress has been a game-changer. Their app is intuitive, selection is vast, and customer service is top-notch. Highly recommended!',
      rating: 5,
      location: 'Bangalore',
      date: 'March 5, 2025'
    },
    {
      id: 3,
      name: 'Lakshmi Raghavan',
      position: 'Fitness Instructor',
      image: person3, // Placeholder for Hyderabad Charminar
      content: 'I love that AaharExpress includes healthy options and accurate nutritional information. Makes it easy to maintain my diet while still enjoying delicious restaurant food.',
      rating: 4,
      location: 'Hyderabad',
      date: 'February 28, 2025'
    },
    {
      id: 4,
      name: 'Arjun Mehta',
      position: 'College Professor',
      image: person4, // Placeholder for Delhi
      content: 'The variety of cuisines available on AaharExpress is impressive. I can order anything from South Indian dosas to North Indian thalis, and the quality is consistently excellent.',
      rating: 5,
      location: 'Delhi',
      date: 'February 20, 2025'
    },
    {
      id: 5,
      name: 'Shreya Patel',
      position: 'Healthcare Professional',
      image: person5, // Placeholder for Mumbai
      content: 'Even during Mumbai\'s heavy monsoons, AaharExpress never disappoints with their delivery times. The packaging keeps food safe and dry, which is exactly what you need on rainy days!',
      rating: 5,
      location: 'Mumbai',
      date: 'February 15, 2025'
    },
    {
      id: 6,
      name: 'Rahul Sharma',
      position: 'Software Developer',
      image: person6, // Placeholder for Pune
      content: 'The AaharExpress app remembers my preferences and makes great recommendations. It\'s like having a personal food assistant who knows exactly what I\'m craving!',
      rating: 4,
      location: 'Pune',
      date: 'February 10, 2025'
    },
    {
      id: 7,
      name: 'Ananya Desai',
      position: 'Marketing Executive',
      image: person7,
      content: 'What impresses me most about AaharExpress is their commitment to local restaurants. They showcase small businesses alongside bigger chains, which helps me discover amazing hidden gems in my city.',
      rating: 5,
      location: 'Ahmedabad',
      date: 'February 5, 2025'
    },
    {
      id: 8,
      name: 'Vikram Reddy',
      position: 'Architecture Student',
      image: person8,
      content: 'The late-night delivery options on AaharExpress saved me during exam weeks! Being able to get quality food at 2 AM while studying was a lifesaver. Their delivery personnel are always friendly, even at odd hours.',
      rating: 5,
      location: 'Kolkata',
      date: 'January 28, 2025'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
    }, 8000); // Changed from 5000ms to 8000ms
    
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setActiveIndex(prevIndex => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setActiveIndex(prevIndex => 
      (prevIndex + 1) % testimonials.length
    );
  };

  // Function to handle the "Order Now" button click
  const handleOrderClick = () => {
    navigate('/menu'); // Redirect to the MenuPage component
  };

  // Calculate number of satisfied customers
  const totalCustomers = 15000; // Example number
  const satisfactionRate = 98.7; // Example percentage

  return (
    <section className="testimonials-section section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Join over {totalCustomers.toLocaleString()} satisfied customers with a {satisfactionRate}% satisfaction rate</p>
        </div>
        
        
        
        <div className="testimonials-slider">
          <div className="testimonials-container" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div 
                className={`testimonial-card ${activeIndex === index ? 'active' : ''}`} 
                key={testimonial.id}
              >
                <div className="testimonial-content">
                  <p className="testimonial-text">&quot;{testimonial.content}&quot;</p>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star ${i < testimonial.rating ? 'filled' : ''}`}>★</span>
                    ))}
                  </div>
                  <span className="testimonial-date">{testimonial.date}</span>
                </div>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.location} className="author-image" />
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-position">{testimonial.position} from {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="testimonial-controls">
          <button 
            className="slider-arrow prev" 
            onClick={goToPrevious}
            aria-label="Previous testimonial"
          >
            &lt;
          </button>
          
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${activeIndex === index ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            className="slider-arrow next" 
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            &gt;
          </button>
        </div>
        
        <div className="testimonial-cta">
          <p>Experience our exceptional service for yourself</p>
          <button className="cta-button" onClick={handleOrderClick}>Order Now</button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;