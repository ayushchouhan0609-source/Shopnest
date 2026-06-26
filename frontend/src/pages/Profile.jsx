import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const stored = user || JSON.parse(localStorage.getItem('userInfo') || 'null');

  const [form, setForm] = useState({
    name: stored?.name || '',
    email: stored?.email || '',
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    if (!stored || !stored.token) return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${stored.token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to load orders');
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setOrdersError(err.message || 'Unable to load orders');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [stored]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // No backend update endpoint implemented — update locally
    const updated = { ...stored, name: form.name, email: form.email };
    login(updated);
    alert('Profile updated locally.');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!stored) {
    return (
      <div className="shop-page">
        <div className="empty-cart-card">
          <h2>Not signed in</h2>
          <p>Please sign in to view your profile and orders.</p>
          <Link to="/login" className="btn">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="page-heading">
        <div>
          <h1>My Profile</h1>
          <p className="cart-summary">Manage your account details and view recent orders.</p>
        </div>
        <div>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </div>

      <div className="cart-grid">
        <section className="cart-items-panel">
          <div className="summary-card">
            <h2>Account Details</h2>
            <form onSubmit={handleSave} className="checkout-form">
              <div className="form-row">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" value={form.email} onChange={handleChange} type="email" required />
              </div>

              <div className="form-row">
                <button type="submit" className="btn">Save Profile</button>
              </div>
            </form>
          </div>
        </section>

        <aside className="cart-summary-panel">
          <div className="summary-card">
            <h2>My Orders</h2>
            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : ordersError ? (
              <p style={{ color: '#f87171' }}>{ordersError}</p>
            ) : orders.length === 0 ? (
              <p>No past orders found.</p>
            ) : (
              <div className="checkout-item-list">
                {orders.map((o) => (
                  <div key={o._id} className="checkout-item">
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700 }}>{o._id}</div>
                      <div style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{new Date(o.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div>₹{(o.totalAmount || 0).toFixed(2)}</div>
                      <div style={{ color: '#f97316', fontWeight: 700 }}>{o.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Profile;
