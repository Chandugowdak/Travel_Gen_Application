import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/explore', label: 'Explore', icon: '🌍' },
    { path: '/bookings', label: 'Bookings', icon: '📅' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="app-navbar">
      <div className="nav-container">
        <Link to="/home" className="brand">
          ✈️ TravelGen
        </Link>

        {isAuthenticated() && (
          <>
            <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              ☰
            </button>
            <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="nav-right">
          {isAuthenticated() ? (
            <ProfileMenu />
          ) : (
            <Link to="/auth" className="nav-link">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
