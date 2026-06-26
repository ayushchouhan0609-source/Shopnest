import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        setError(err.message || 'Unable to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to delete product');
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (err) {
      alert(err.message || 'Unable to delete product');
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading products...</div>;
  if (error) return <div style={{ padding: 40, color: '#f87171' }}>{error}</div>;

  return (
    <div className="shop-page">
      <div className="page-heading">
        <div>
          <h1>Products</h1>
          <p className="cart-summary">Manage store products ({products.length})</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/add-product" className="btn">Add Product</Link>
          <button onClick={() => navigate('/admin')} className="btn btn-secondary">Dashboard</button>
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
                <Link to={`/product/${p._id}`} className="btn btn-secondary">View</Link>
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

export default AdminProducts;
