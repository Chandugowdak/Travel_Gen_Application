import React from 'react';
import './ExplorePage.css';

const ExplorePage = () => {
  const destinations = [
    { id: 1, name: 'Paris', country: 'France', image: '🗼', description: 'City of love and culture' },
    { id: 2, name: 'Tokyo', country: 'Japan', image: '🗾', description: 'Modern meets tradition' },
    { id: 3, name: 'New York', country: 'USA', image: '🗽', description: 'The city that never sleeps' },
    { id: 4, name: 'Bali', country: 'Indonesia', image: '🏝️', description: 'Tropical paradise' },
    { id: 5, name: 'London', country: 'UK', image: '🎡', description: 'Historic and vibrant' },
    { id: 6, name: 'Sydney', country: 'Australia', image: '🦘', description: 'Sun, beaches, and adventure' },
  ];

  return (
    <div className="explore-page">
      <div className="explore-hero">
        <h1>Explore Destinations</h1>
        <p>Discover amazing places around the world</p>
      </div>
      <div className="explore-grid">
        {destinations.map((dest) => (
          <div key={dest.id} className="destination-card">
            <div className="dest-emoji">{dest.image}</div>
            <h3>{dest.name}</h3>
            <p className="country">{dest.country}</p>
            <p className="description">{dest.description}</p>
            <button className="explore-btn">Learn More</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
