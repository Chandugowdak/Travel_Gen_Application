import React, { useState } from 'react';
import apiProvider from '../../services/apiProvider';

const Login = ({ onLoginSuccess, showMessage, showError }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    showMessage('');
    showError('');

    try {
      const data = await apiProvider.login(formData);
      const { token, user: loggedUser } = data;

      setFormData({ email: '', password: '' });
      onLoginSuccess(loggedUser, token);
      showMessage('Welcome back! You are now logged in.');
    } catch (err) {
      showError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="field-group">
        <span>Email Address</span>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your@email.com"
          required
        />
      </label>

      <label className="field-group">
        <span>Password</span>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          required
          minLength={6}
        />
      </label>

      <button className="submit-button" type="submit" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default Login;
