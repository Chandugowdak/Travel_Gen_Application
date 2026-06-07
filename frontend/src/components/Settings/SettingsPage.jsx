import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    notifications: true,
    newsletter: false,
    travelType: 'Adventure',
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="settings-page">
      <div className="settings-hero">
        <h1>Settings & Preferences</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-container">
        {/* Profile Section */}
        <div className="settings-section">
          <h2>Profile Information</h2>
          <div className="profile-info-display">
            <div className="avatar-display">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="profile-details">
              <div className="detail-item">
                <label>Full Name</label>
                <p>{user?.name}</p>
              </div>
              <div className="detail-item">
                <label>Email Address</label>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>
          <button className="btn-secondary">Edit Profile</button>
        </div>

        {/* Preferences Section */}
        <div className="settings-section">
          <h2>Travel Preferences</h2>
          <div className="preference-item">
            <label>Preferred Travel Type</label>
            <select name="travelType" value={preferences.travelType} onChange={handleChange}>
              <option>Adventure</option>
              <option>Relaxation</option>
              <option>Cultural</option>
              <option>Business</option>
            </select>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="checkbox-item">
            <input type="checkbox" id="notifications" name="notifications" checked={preferences.notifications} onChange={handleChange} />
            <label htmlFor="notifications">Email Notifications for Deals</label>
          </div>
          <div className="checkbox-item">
            <input type="checkbox" id="newsletter" name="newsletter" checked={preferences.newsletter} onChange={handleChange} />
            <label htmlFor="newsletter">Subscribe to Newsletter</label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <h2>Account</h2>
          <button className="btn-danger" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
