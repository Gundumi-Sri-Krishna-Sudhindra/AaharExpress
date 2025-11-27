import React from 'react';
import './ImpactTracker.css';

const ImpactTracker = () => {
  // This would typically come from your backend
  const impactData = {
    totalMealsDonated: 15000,
    peopleHelped: 7500,
    activeDonors: 2500,
    totalDonations: 450000,
    recentStories: [
      {
        id: 1,
        title: "A Family's Journey to Recovery",
        content: "Thanks to your donations, we were able to provide daily meals to a family of four during their difficult time.",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        date: "2024-03-15"
      },
      {
        id: 2,
        title: "Community Kitchen Success",
        content: "Our community kitchen served over 500 meals last week, made possible by your generous donations.",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        date: "2024-03-10"
      },
      {
        id: 3,
        title: "School Lunch Program",
        content: "We've expanded our school lunch program to reach 200 more children in need.",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        date: "2024-03-05"
      }
    ]
  };

  return (
    <div className="impact-tracker">
      <div className="impact-header">
        <h2>Our Impact</h2>
        <p>Together, we're making a difference in our community</p>
      </div>

      <div className="impact-stats-grid">
        <div className="impact-stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-value">{impactData.totalMealsDonated.toLocaleString()}</div>
          <div className="stat-label">Meals Donated</div>
        </div>
        <div className="impact-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{impactData.peopleHelped.toLocaleString()}</div>
          <div className="stat-label">People Helped</div>
        </div>
        <div className="impact-stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-value">{impactData.activeDonors.toLocaleString()}</div>
          <div className="stat-label">Active Donors</div>
        </div>
        <div className="impact-stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{impactData.totalDonations.toLocaleString()}</div>
          <div className="stat-label">Total Donations</div>
        </div>
      </div>

      <div className="impact-stories">
        <h3>Recent Impact Stories</h3>
        <div className="stories-grid">
          {impactData.recentStories.map(story => (
            <div key={story.id} className="story-card">
              <div className="story-image">
                <img src={story.image} alt={story.title} />
              </div>
              <div className="story-content">
                <h4>{story.title}</h4>
                <p>{story.content}</p>
                <div className="story-date">{new Date(story.date).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="impact-cta">
        <h3>Join Our Mission</h3>
        <p>Be part of the change. Your donation can make a real difference.</p>
        <button className="donate-cta-button">Donate Now</button>
      </div>
    </div>
  );
};

export default ImpactTracker; 