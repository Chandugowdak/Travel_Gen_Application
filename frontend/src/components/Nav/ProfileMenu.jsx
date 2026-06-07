import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './ProfileMenu.css';

const ProfileMenu = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setDropdownOpen(false);
  };

  return (
    <div className="profile-menu">
      <button className="profile-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <div className="avatar">{user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
      </button>
      {dropdownOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="avatar-large">{user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
            <div className="user-info">
              <div className="name">{user?.name}</div>
              <div className="email">{user?.email}</div>
            </div>
          </div>
          <button onClick={() => { navigate('/settings'); setDropdownOpen(false); }} className="dropdown-item">
            ⚙️ Settings
          </button>
          <button onClick={handleLogout} className="dropdown-item danger">
            🚪 Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
