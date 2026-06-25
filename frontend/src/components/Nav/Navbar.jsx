import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { AuthContext } from '../../context/AuthContext';
import { FaHome, FaCompass, FaCalendarAlt, FaCog, FaPlaneDeparture } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', icon: <FaHome /> },
    { path: '/explore', label: 'Explore', icon: <FaCompass /> },
    { path: '/bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
    { path: '/settings', label: 'Settings', icon: <FaCog /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="app-navbar glass-panel">
      <div className="nav-container">
        <Link to="/home" className="brand">
          <FaPlaneDeparture className="brand-logo" />
          <span>TravelGen</span>
        </Link>

        {isAuthenticated() && (
          <button 
            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        )}

        {isAuthenticated() && (
          <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="nav-right">
          {isAuthenticated() ? (
            <ProfileMenu />
          ) : (
            <Link to="/auth" className="auth-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
