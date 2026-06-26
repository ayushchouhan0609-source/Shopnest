import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = (() => {
    try {
      const data = JSON.parse(localStorage.getItem('userInfo'));
      return data?.token;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, orderRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders', {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }),
        ]);

        if (!prodRes.ok) throw new Error('Failed to load products');
        const prods = await prodRes.json();
        setProducts(prods || []);

        if (orderRes.ok) {
          const orders = await orderRes.json();
          setOrdersCount(Array.isArray(orders) ? orders.length : 0);
        } else {
          setOrdersCount(0);
        }
      } catch (err) {
        setError(err.message || 'Unable to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete');
      }
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.message || 'Unable to delete product');
    }
  };

  const handleRefresh = () => window.location.reload();

  if (loading) return <div style={{ padding: 40 }}>Loading admin data...</div>;
  if (error) return <div style={{ padding: 40, color: '#f87171' }}>{error}</div>;

  return (
    <div className="shop-page">
      <div className="page-heading">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="cart-summary">Products: {products.length} • Orders: {ordersCount}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/add-product" className="btn">Add Product</Link>
          <button onClick={handleRefresh} className="btn btn-secondary">Refresh</button>
        </div>
      </div>

      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <img src={p.imageUrl || 'https://via.placeholder.com/300'} alt={p.name} className="product-image" />
            <div className="product-info">
              <div>
                <h3 className="product-name">{p.name}</h3>
                <p className="product-price">₹{(p.price || 0).toFixed(2)}</p>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{p.category || '—'}</p>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => navigate(`/product/${p._id}`)} className="btn btn-secondary">View</button>
                <Link to={`/admin/edit-product/${p._id}`} className="btn">Edit</Link>
                <button onClick={() => handleDelete(p._id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
