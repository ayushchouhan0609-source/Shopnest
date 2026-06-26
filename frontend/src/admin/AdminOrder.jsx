import React, { useEffect, useState } from 'react';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const token = (() => {
    try {
      const data = JSON.parse(localStorage.getItem('userInfo'));
      return data?.token;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to load orders');
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || 'Unable to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const updateStatus = async (orderId, status) => {
    if (!window.confirm(`Change status to ${status}?`)) return;
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update status');
      // update local state
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: json.order?.status || status } : o)));
    } catch (err) {
      alert(err.message || 'Unable to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading orders...</div>;
  if (error) return <div style={{ padding: 40, color: '#f87171' }}>{error}</div>;

  return (
    <div className="shop-page">
      <div className="page-heading">
        <div>
          <h1>Orders</h1>
          <p className="cart-summary">Manage all orders placed by users.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {orders.length === 0 && <div className="empty-cart-card"><h3>No orders found</h3></div>}

        {orders.map((order) => (
          <div key={order._id} className="summary-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{order._id}</div>
              <div style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleString()}</div>
              <div style={{ marginTop: 8 }}>User: {order.user?.name || order.user?.email || '—'}</div>
              <div style={{ marginTop: 8 }}>Total: ₹{(order.totalAmount || 0).toFixed(2)}</div>
              <div style={{ marginTop: 8 }}>Items: {Array.isArray(order.products) ? order.products.length : 0}</div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                disabled={updatingId === order._id}
                style={{ padding: '8px 10px', borderRadius: 8, background: '#0f172a', color: '#fff', border: '1px solid #27272a' }}
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
              {updatingId === order._id ? <span>Updating...</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrder;
