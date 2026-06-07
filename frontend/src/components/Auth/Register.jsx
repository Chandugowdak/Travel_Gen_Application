import React, { useState } from 'react';
import apiProvider from '../../services/apiProvider';

const Register = ({ onRegisterSuccess, showMessage, showError, switchToLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      const data = await apiProvider.register(formData);
      setFormData({ name: '', email: '', password: '' });
      showMessage(
        'Account created successfully! Please log in with your credentials.'
      );
      onRegisterSuccess();
      setTimeout(() => switchToLogin(), 2000);
    } catch (err) {
      showError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="field-group">
        <span>Full Name</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="John Doe"
          required
        />
      </label>

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
          placeholder="Create a strong password"
          required
          minLength={6}
        />
      </label>

      <button className="submit-button" type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default Register;
