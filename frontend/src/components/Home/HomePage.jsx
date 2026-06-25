import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiProvider from "../../services/apiProvider";
import "./HomePage.css";

import {
  FaPlaneDeparture,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaWallet,
  FaTrash,
  FaRoute,
  FaArrowRight,
  FaRedo,
  FaTimes,
  FaCompass,
  FaBriefcase,
  FaSync,
  FaPrint
} from "react-icons/fa";

const initialForm = {
  UserStartPlace: "",
  UserDestination: "",
  UserData: "",
  NuberOfDays: 3,
  UserBudget: "Mid-Range",
  UserTravelBy: "Flight",
  TotelNumberofPeoples: 1,
};

const HomePage = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [form, setForm] = useState(initialForm);
  
  // Modal state
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const fetchRequests = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await apiProvider.getUserRequests(user._id);
      setRequests(res.data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setActionMessage("Consulting AI Travel Agent...");
    
    // Smooth loader messages
    const timers = [
      setTimeout(() => setActionMessage("Analyzing travel route..."), 1500),
      setTimeout(() => setActionMessage("Designing day-by-day itinerary..."), 3000),
      setTimeout(() => setActionMessage("Checking packing essentials..."), 4500),
    ];

    try {
      await apiProvider.createRequest({
        ...form,
        userID: user._id,
      });
      setForm(initialForm);
      await fetchRequests();
    } catch (err) {
      console.error("Error creating plan:", err);
    } finally {
      timers.forEach(t => clearTimeout(t));
      setCreating(false);
      setActionMessage("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip request?")) return;
    try {
      await apiProvider.deleteRequest(id);
      fetchRequests();
      if (selectedTrip?._id === id) {
        setModalOpen(false);
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
    }
  };

  const openItinerary = (trip) => {
    setSelectedTrip(trip);
    setModalOpen(true);
  };

  const handleRegenerate = async () => {
    if (!selectedTrip) return;
    setRegenerating(true);
    try {
      const res = await apiProvider.regenerateRequest(selectedTrip._id);
      if (res.data) {
        setSelectedTrip(res.data);
        // Refresh requests list in background
        const listRes = await apiProvider.getUserRequests(user._id);
        setRequests(listRes.data || []);
      }
    } catch (err) {
      console.error("Regeneration failed:", err);
      alert("Failed to regenerate itinerary. Please check your AI API keys configuration.");
    } finally {
      setRegenerating(false);
    }
  };

  // Dynamic Markdown-to-HTML Parser
  const renderItineraryMarkdown = (text) => {
    if (!text) {
      return (
        <div className="empty-itinerary">
          <p>No plan details generated yet. Click below to trigger AI Generation.</p>
          <button className="btn-primary" onClick={handleRegenerate}>
            <FaSync /> Generate Plan with AI
          </button>
        </div>
      );
    }

    const parseBold = (str) => {
      const parts = str.split('**');
      return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
    };

    const lines = text.split('\n');
    let listItems = [];
    const elements = [];

    const flushList = (key) => {
      if (listItems.length > 0) {
        elements.push(<ul key={`list-${key}`} className="itinerary-bullet-list">{...listItems}</ul>);
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Checkbox list item
      if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
        flushList(index);
        const checked = trimmed.startsWith('- [x]');
        const content = trimmed.substring(5).trim();
        elements.push(
          <label key={index} className="itinerary-check-item">
            <input type="checkbox" defaultChecked={checked} />
            <span>{parseBold(content)}</span>
          </label>
        );
        return;
      }

      // Normal Bullet lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2).trim();
        listItems.push(
          <li key={index} className="itinerary-list-item">
            {parseBold(content)}
          </li>
        );
        return;
      }

      // Headings
      if (trimmed.startsWith('###')) {
        flushList(index);
        const content = trimmed.replace(/^###\s*/, '');
        if (content.toLowerCase().includes('day')) {
          elements.push(
            <div key={index} className="itinerary-day-divider">
              <h3>{content}</h3>
            </div>
          );
        } else {
          elements.push(<h4 key={index} className="itinerary-h4">{content}</h4>);
        }
        return;
      }

      if (trimmed.startsWith('##')) {
        flushList(index);
        const content = trimmed.replace(/^##\s*/, '');
        elements.push(<h2 key={index} className="itinerary-h2">{content}</h2>);
        return;
      }

      // Quote alerts
      if (trimmed.startsWith('>')) {
        flushList(index);
        const content = trimmed.replace(/^>\s*(\[!NOTE\]|\[!TIP\]|\[!IMPORTANT\])?\s*/, '');
        elements.push(
          <div key={index} className="itinerary-note-box">
            <span className="note-icon">💡</span>
            <p>{parseBold(content)}</p>
          </div>
        );
        return;
      }

      // Paragraph / Empty lines
      if (trimmed === '') {
        flushList(index);
      } else {
        flushList(index);
        elements.push(<p key={index} className="itinerary-paragraph">{parseBold(trimmed)}</p>);
      }
    });

    flushList(lines.length);
    return elements;
  };

  return (
    <div className="home-shell">
      {/* Visual Loader Overlay */}
      {creating && (
        <div className="creation-loader-overlay">
          <div className="loader-box glass-panel">
            <FaCompass className="spinning-compass" />
            <h3>Creating Your Adventure</h3>
            <p className="loader-text-status">{actionMessage}</p>
            <div className="loading-progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="home-container">
        
        {/* Planner Sidebar */}
        <aside className="planner-aside glass-panel">
          <div className="aside-header">
            <h2><FaRoute /> Plan Journey</h2>
            <p>Tell us where you want to go, and let AI do the rest.</p>
          </div>

          <form className="trip-creation-form" onSubmit={handleCreate}>
            <div className="form-group">
              <label>Departure Point</label>
              <input
                name="UserStartPlace"
                placeholder="City or Airport (e.g. New York)"
                value={form.UserStartPlace}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Destination Location</label>
              <input
                name="UserDestination"
                placeholder="Where to? (e.g. Paris)"
                value={form.UserDestination}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Date of Departure</label>
                <input
                  type="date"
                  name="UserData"
                  value={form.UserData}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  name="NuberOfDays"
                  value={form.NuberOfDays}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Budget Level</label>
              <select name="UserBudget" value={form.UserBudget} onChange={handleChange}>
                <option value="Economy">Economy (Backpacker)</option>
                <option value="Mid-Range">Mid-Range (Comfortable)</option>
                <option value="Luxury">Luxury (Premium)</option>
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Travel Mode</label>
                <select name="UserTravelBy" value={form.UserTravelBy} onChange={handleChange}>
                  <option value="Flight">✈️ Flight</option>
                  <option value="Train">🚄 Train</option>
                  <option value="Car">🚗 Car/Roadtrip</option>
                  <option value="Bus">🚌 Bus</option>
                  <option value="Cruise">🚢 Cruise</option>
                </select>
              </div>

              <div className="form-group">
                <label>Travelers</label>
                <input
                  type="number"
                  min="1"
                  name="TotelNumberofPeoples"
                  value={form.TotelNumberofPeoples}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button className="btn-primary create-submit-btn" type="submit">
              Generate AI Plan <FaArrowRight />
            </button>
          </form>
        </aside>

        {/* Plans Area */}
        <main className="dashboard-main">
          <div className="main-header">
            <h1>Welcome, {user?.name || "Traveler"} 👋</h1>
            <p>You have {requests.length} custom itineraries planned</p>
          </div>

          {loading ? (
            <div className="dashboard-loading-state">
              <FaSync className="spinning-loader" />
              <p>Fetching your travel plans...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="dashboard-empty-state glass-panel">
              <div className="empty-icon-shell">
                <FaBriefcase />
              </div>
              <h3>Your map is empty</h3>
              <p>Create your first travel request in the left panel to generate an AI-powered travel plan immediately.</p>
            </div>
          ) : (
            <div className="plans-grid">
              {requests.map((r) => (
                <div className="plan-card glass-panel" key={r._id}>
                  <div className="plan-card-header">
                    <div className="plan-destination-badge">🏝️ {r.UserDestination}</div>
                    <button className="plan-delete-btn" onClick={() => handleDelete(r._id)} title="Delete Trip">
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className="plan-route-info">
                    <span className="route-city">{r.UserStartPlace}</span>
                    <FaArrowRight className="route-arrow" />
                    <span className="route-city highlight">{r.UserDestination}</span>
                  </div>

                  <div className="plan-specs-grid">
                    <div className="spec-item">
                      <FaCalendarAlt />
                      <span>{new Date(r.UserData).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: '2-digit'})}</span>
                    </div>
                    <div className="spec-item">
                      <FaUsers />
                      <span>{r.TotelNumberofPeoples} Traveler(s)</span>
                    </div>
                    <div className="spec-item">
                      <FaWallet />
                      <span>{r.UserBudget}</span>
                    </div>
                    <div className="spec-item">
                      <span>⏳ {r.NuberOfDays} Day(s)</span>
                    </div>
                  </div>

                  <div className="plan-card-footer">
                    <span className="travel-mode-indicator">
                      {r.UserTravelBy === "Flight" ? "✈️" : r.UserTravelBy === "Train" ? "🚄" : r.UserTravelBy === "Car" ? "🚗" : r.UserTravelBy === "Bus" ? "🚌" : "🚢"} {r.UserTravelBy}
                    </span>
                    <button className="btn-primary view-itinerary-btn" onClick={() => openItinerary(r)}>
                      View Itinerary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Itinerary Modal View */}
      {modalOpen && selectedTrip && (
        <div className="modal-backdrop">
          <div className="modal-card glass-panel animate-modal">
            
            <div className="modal-header">
              <div className="modal-title-box">
                <h2>🏖️ Route: {selectedTrip.UserStartPlace} to {selectedTrip.UserDestination}</h2>
                <div className="modal-subtitle-badges">
                  <span>📅 {new Date(selectedTrip.UserData).toLocaleDateString()}</span>
                  <span>⏳ {selectedTrip.NuberOfDays} Days</span>
                  <span>💰 {selectedTrip.UserBudget}</span>
                  <span>✈️ {selectedTrip.UserTravelBy}</span>
                  <span>👥 {selectedTrip.TotelNumberofPeoples} People</span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body-content">
              {regenerating ? (
                <div className="modal-regenerating-loader">
                  <FaSync className="spinning-loader" />
                  <h4>Re-generating itinerary with AI...</h4>
                  <p>Our travel agents are mapping out new experiences for you.</p>
                </div>
              ) : (
                <div className="itinerary-document">
                  {renderItineraryMarkdown(selectedTrip.generatedPlan)}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary modal-btn-secondary" onClick={() => window.print()}>
                <FaPrint /> Print Plan
              </button>
              <button 
                className="btn-primary modal-btn-primary" 
                onClick={handleRegenerate}
                disabled={regenerating}
              >
                <FaRedo /> Regenerate Plan with AI
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
