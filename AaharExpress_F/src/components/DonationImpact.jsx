import React from 'react';
import './DonationImpact.css';

const DonationImpact = () => {
  const impactStats = {
    totalDonations: 450000,
    mealsProvided: 15000,
    peopleHelped: 7500,
    activeDonors: 2500,
    recentImpact: [
      {
        id: 1,
        title: "Community Kitchen Expansion",
        description: "Your donations helped us expand our community kitchen, allowing us to serve 500 more meals daily.",
        date: "2024-03-15",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 2,
        title: "School Lunch Program",
        description: "Thanks to your support, we've been able to provide nutritious lunches to 200 students daily.",
        date: "2024-03-10",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 3,
        title: "Emergency Food Relief",
        description: "Your contributions helped us respond quickly to the recent crisis, providing immediate food assistance to affected families.",
        date: "2024-03-05",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ]
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="donation-impact">
      <div className="impact-header">
        <h2>Your Impact</h2>
        <p>See how your donations are making a difference in our community</p>
      </div>

      <div className="impact-stats">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">${formatNumber(impactStats.totalDonations)}</div>
          <div className="stat-label">Total Donations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-value">{formatNumber(impactStats.mealsProvided)}</div>
          <div className="stat-label">Meals Provided</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{formatNumber(impactStats.peopleHelped)}</div>
          <div className="stat-label">People Helped</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-value">{formatNumber(impactStats.activeDonors)}</div>
          <div className="stat-label">Active Donors</div>
        </div>
      </div>

      <div className="recent-impact">
        <h3>Recent Impact</h3>
        <div className="impact-grid">
          {impactStats.recentImpact.map(impact => (
            <div key={impact.id} className="impact-card">
              <div className="impact-image">
                <img src={impact.image} alt={impact.title} />
              </div>
              <div className="impact-content">
                <h4>{impact.title}</h4>
                <p>{impact.description}</p>
                <div className="impact-date">
                  {new Date(impact.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="impact-cta">
        <h3>Join Our Mission</h3>
        <p>Your donation can help us provide more meals and support to those in need.</p>
        <button className="donate-button">Donate Now</button>
      </div>
    </div>
  );
};

export default DonationImpact; 