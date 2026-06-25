import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { AuthContext } from '../../context/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user, login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home');
    }
  }, [user, navigate, isAuthenticated]);

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
    navigate('/home');
  };

  const handleRegisterSuccess = () => {
    // Registration successful, user will switch to login
  };

  const switchToLogin = () => {
    setActiveTab('login');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card-container glass-panel">
        <div className="auth-visual-side">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <span className="visual-tag">🚀 AI Travel Planner</span>
            <h2>Discover Your Next Big Adventure</h2>
            <p>
              Plan itineraries, estimate expenses, explore spots, and create travel maps with our smart open-source AI engine.
            </p>
            <div className="visual-features">
              <div className="v-feature"><span>🏝️</span> Intelligent Route Building</div>
              <div className="v-feature"><span>💰</span> Dynamic Expense Tracking</div>
              <div className="v-feature"><span>📅</span> Day-by-Day Custom Itineraries</div>
            </div>
          </div>
        </div>
        
        <div className="auth-form-side">
          <div className="auth-header-logo">
            <span className="logo-emoji">✈️</span> TravelGen
          </div>
          
          <div className="auth-tabs">
            <button
              className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setMessage('');
                setError('');
              }}
            >
              Sign In
            </button>
            <button
              className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setMessage('');
                setError('');
              }}
            >
              Join Us
            </button>
          </div>

          <div className="auth-form-body">
            {activeTab === 'login' ? (
              <div className="pane-content">
                <h3>Welcome Back</h3>
                <p className="pane-subtitle">Enter details to continue planning your trips.</p>
                <Login
                  onLoginSuccess={handleLoginSuccess}
                  showMessage={showMessage}
                  showError={showError}
                />
              </div>
            ) : (
              <div className="pane-content">
                <h3>Create Account</h3>
                <p className="pane-subtitle">Register to unlock personalized AI itineraries.</p>
                <Register
                  onRegisterSuccess={handleRegisterSuccess}
                  showMessage={showMessage}
                  showError={showError}
                  switchToLogin={switchToLogin}
                />
              </div>
            )}
            
            {message && <div className="auth-alert success-alert">{message}</div>}
            {error && <div className="auth-alert error-alert">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
