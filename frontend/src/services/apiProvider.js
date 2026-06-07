const API_BASE = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('travel-app-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiProvider = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password }
   * @returns {Promise<Object>} response data
   */
  register: async (userData) => {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  /**
   * Login a user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} response data with token
   */
  login: async (credentials) => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  /**
   * Store JWT token in localStorage
   * @param {string} token - JWT token
   */
  setToken: (token) => {
    localStorage.setItem('travel-app-token', token);
  },

  /**
   * Get JWT token from localStorage
   * @returns {string|null} JWT token
   */
  getToken: () => {
    return localStorage.getItem('travel-app-token');
  },

  /**
   * Remove JWT token from localStorage
   */
  clearToken: () => {
    localStorage.removeItem('travel-app-token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('travel-app-token');
  },

  /**
   * Fetch user's travel requests
   * @param {string} userId
   */
  getUserRequests: async (userId) => {
    const response = await fetch(`${API_BASE}/user-requests/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch requests');
    return data;
  },

  createRequest: async (payload) => {
    const response = await fetch(`${API_BASE}/create/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create request');
    return data;
  },

  editRequest: async (id, payload) => {
    const response = await fetch(`${API_BASE}/edit/request/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to edit request');
    return data;
  },

  deleteRequest: async (id) => {
    const response = await fetch(`${API_BASE}/delete/request/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete request');
    return data;
  },
};

export default apiProvider;
