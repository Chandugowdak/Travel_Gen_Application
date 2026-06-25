import React from "react";
import "./BookingsPage.css";
import {
  FaPlaneDeparture,
  FaCalendarAlt,
  FaWallet,
  FaEdit,
  FaEye,
} from "react-icons/fa";

const BookingsPage = () => {
  const bookings = [
    {
      id: 1,
      destination: "Paris",
      date: "2024-06-15",
      status: "Confirmed",
      budget: "$2,500",
    },
    {
      id: 2,
      destination: "Tokyo",
      date: "2024-08-20",
      status: "Pending",
      budget: "$3,200",
    },
    {
      id: 3,
      destination: "New York",
      date: "2024-07-10",
      status: "Confirmed",
      budget: "$1,800",
    },
  ];

  return (
    <div className="container bookings-page">

      <div className="hero-section">
        <h1>
          <FaPlaneDeparture /> My Travel Bookings
        </h1>
        <p>Track and manage your dream destinations</p>
      </div>

      <div className="row g-4">
        {bookings.map((booking) => (
          <div className="col-lg-4 col-md-6" key={booking.id}>
            <div className="booking-card">

              <div className="top-section">
                <h3>{booking.destination}</h3>

                <span
                  className={`badge custom-badge ${
                    booking.status === "Confirmed"
                      ? "confirmed"
                      : "pending"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="details">

                <div>
                  <FaCalendarAlt />
                  <span>{booking.date}</span>
                </div>

                <div>
                  <FaWallet />
                  <span>{booking.budget}</span>
                </div>

              </div>

              <div className="btn-group-custom">

                <button className="btn view-btn">
                  <FaEye />
                  View
                </button>

                <button className="btn edit-btn">
                  <FaEdit />
                  Edit
                </button>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;