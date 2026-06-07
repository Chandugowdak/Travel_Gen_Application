import React from 'react';
import './BookingsPage.css';

const BookingsPage = () => {
  const bookings = [
    { id: 1, destination: 'Paris', date: '2024-06-15', status: 'Confirmed', budget: '$2,500' },
    { id: 2, destination: 'Tokyo', date: '2024-08-20', status: 'Pending', budget: '$3,200' },
    { id: 3, destination: 'New York', date: '2024-07-10', status: 'Confirmed', budget: '$1,800' },
  ];

  return (
    <div className="bookings-page">
      <div className="bookings-hero">
        <h1>My Bookings</h1>
        <p>Manage your travel reservations</p>
      </div>
      <div className="bookings-list">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>No bookings yet. Start planning your trip!</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.destination}</h3>
                <span className={`status status-${booking.status.toLowerCase()}`}>{booking.status}</span>
              </div>
              <div className="booking-details">
                <div className="detail">
                  <span className="label">Travel Date:</span>
                  <span className="value">{booking.date}</span>
                </div>
                <div className="detail">
                  <span className="label">Budget:</span>
                  <span className="value">{booking.budget}</span>
                </div>
              </div>
              <div className="booking-actions">
                <button className="btn-secondary">View Details</button>
                <button className="btn-primary">Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
