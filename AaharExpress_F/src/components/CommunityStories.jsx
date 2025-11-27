import React from 'react';
import './CommunityStories.css';

const CommunityStories = () => {
  const stories = [
    {
      id: 1,
      title: "A Meal That Changed Everything",
      content: "Thanks to AaharExpress's donation program, we were able to provide hot meals to over 100 families in our community during the recent crisis. The impact was immediate and heartwarming.",
      author: "Sarah Johnson",
      role: "Community Center Director",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Small Donations, Big Impact",
      content: "I started donating just $5 with each order, and seeing the impact reports made me realize how much difference even small contributions can make. Now I'm a regular donor!",
      author: "Michael Chen",
      role: "Regular Donor",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Building a Better Community",
      content: "The transparency in how donations are used and the regular updates on impact have helped us build trust with our donors. It's amazing to see the community come together.",
      author: "Emma Rodriguez",
      role: "Local Food Bank Volunteer",
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="community-stories">
      <div className="stories-header">
        <h2>Community Impact Stories</h2>
        <p>See how your donations are making a difference in our community</p>
      </div>

      <div className="stories-grid">
        {stories.map(story => (
          <div key={story.id} className="story-card">
            <div className="story-image">
              <img src={story.image} alt={story.title} />
            </div>
            <div className="story-content">
              <h3>{story.title}</h3>
              <p>{story.content}</p>
              <div className="story-author">
                <div className="author-info">
                  <strong>{story.author}</strong>
                  <span>{story.role}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="share-story">
        <h3>Share Your Story</h3>
        <p>Have a story about how AaharExpress has made a difference in your life? We'd love to hear it!</p>
        <button className="share-button">Share Your Story</button>
      </div>
    </div>
  );
};

export default CommunityStories; 