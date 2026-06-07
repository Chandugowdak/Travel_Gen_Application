import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import apiProvider from '../../services/apiProvider';
import './HomePage.css';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ UserStartPlace: '', UserDestination: '', UserData: '', NuberOfDays: 1, UserBudget: '', UserTravelBy: '', TotelNumberofPeoples: 1 });

  const fetchRequests = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await apiProvider.getUserRequests(user._id);
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, userID: user._id };
      await apiProvider.createRequest(payload);
      setForm({ UserStartPlace: '', UserDestination: '', UserData: '', NuberOfDays: 1, UserBudget: '', UserTravelBy: '', TotelNumberofPeoples: 1 });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiProvider.deleteRequest(id);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="home-shell">
      <div className="home-hero">
        <h1>Welcome back{user?.name ? `, ${user.name}` : ''}!</h1>
        <p>Manage your travel requests and plan your next trip.</p>
      </div>

      <div className="home-content">
        <aside className="side-panel">
          <h3>Create New Request</h3>
          <form onSubmit={handleCreate} className="request-form">
            <label>
              From
              <input name="UserStartPlace" value={form.UserStartPlace} onChange={handleChange} required />
            </label>
            <label>
              To
              <input name="UserDestination" value={form.UserDestination} onChange={handleChange} required />
            </label>
            <label>
              Date
              <input type="date" name="UserData" value={form.UserData} onChange={handleChange} required />
            </label>
            <label>
              Days
              <input type="number" min="1" name="NuberOfDays" value={form.NuberOfDays} onChange={handleChange} required />
            </label>
            <label>
              Budget
              <input name="UserBudget" value={form.UserBudget} onChange={handleChange} />
            </label>
            <label>
              Travel By
              <input name="UserTravelBy" value={form.UserTravelBy} onChange={handleChange} />
            </label>
            <label>
              People
              <input type="number" min="1" name="TotelNumberofPeoples" value={form.TotelNumberofPeoples} onChange={handleChange} />
            </label>
            <button type="submit" className="primary">Create</button>
          </form>
        </aside>

        <main className="requests-panel">
          <h3>My Requests</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="requests-list">
              {requests.length === 0 && <div>No requests yet.</div>}
              {requests.map((r) => (
                <div className="request-card" key={r._id}>
                  <div className="route">{r.UserStartPlace} → {r.UserDestination}</div>
                  <div className="meta">Date: {new Date(r.UserData).toLocaleDateString()}</div>
                  <div className="meta">People: {r.TotelNumberofPeoples} • Days: {r.NuberOfDays}</div>
                  <div className="actions">
                    <button onClick={() => handleDelete(r._id)} className="danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
