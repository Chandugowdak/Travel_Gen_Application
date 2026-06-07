import React, { useState, useContext } from 'react';
import Login from './Login';
import Register from './Register';
import apiProvider from '../../services/apiProvider';
import './AuthPage.css';
import { AuthContext } from '../../context/AuthContext';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user, login, logout } = useContext(AuthContext);

  const showMessage = (text) => {
    setError('');
    setMessage(text);
    setTimeout(() => setMessage(''), 4000);
  };

  const showError = (text) => {
    setMessage('');
    setError(text);
    setTimeout(() => setError(''), 4000);
  };

  const handleLoginSuccess = (loggedUser, token) => {
    login(loggedUser, token);
  };

  const handleRegisterSuccess = () => {
    // Registration successful, user will switch to login
  };

  const handleLogout = () => {
    logout();
    setActiveTab('login');
    showMessage('You have been logged out successfully.');
  };

  const switchToLogin = () => {
    setActiveTab('login');
  };


  return (
    <div className="auth-shell">
      <div className="hero-section">
        <h1>Your Journey Awaits</h1>
        <p>
          Plan your perfect trip with our intelligent travel assistant. Sign in or create an account to get started.
        </p>
        <div className="hero-highlight">
          Explore destinations • Book travels • Discover experiences
        </div>
      </div>

      <div className="auth-section">
        {!user ? (
          <div className="auth-container">
            <div className="auth-tabs">
              <button
                className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('login');
                  setMessage('');
                  setError('');
                }}
              >
                Sign In
              </button>
              <button
                className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('register');
                  setMessage('');
                  setError('');
                }}
              >
                Create Account
              </button>
            </div>

            <div className="auth-content">
              {activeTab === 'login' && (
                <div className="tab-pane">
                  <h2>Welcome Back</h2>
                  <p>Sign in to continue planning your next adventure</p>
                  <Login
                    onLoginSuccess={handleLoginSuccess}
                    showMessage={showMessage}
                    showError={showError}
                  />
                </div>
              )}

              {activeTab === 'register' && (
                <div className="tab-pane">
                  <h2>Start Your Adventure</h2>
                  <p>Create a new account to plan your travels</p>
                  <Register
                    onRegisterSuccess={handleRegisterSuccess}
                    showMessage={showMessage}
                    showError={showError}
                    switchToLogin={switchToLogin}
                  />
                </div>
              )}
            </div>

            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert error">{error}</div>}
          </div>
        ) : (
          <div className="profile-section">
            <div className="profile-card">
              <h2>Welcome, {user.name}!</h2>
              <p>You're all set to start planning your next journey.</p>
              <div className="profile-info">
                <span className="label">Email</span>
                <span className="value">{user.email}</span>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
