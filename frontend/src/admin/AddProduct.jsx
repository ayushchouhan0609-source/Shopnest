import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = (() => {
    try {
      const data = JSON.parse(localStorage.getItem('userInfo'));
      return data?.token;
    } catch (e) {
      return null;
    }
  })();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError('You must be signed in as admin to add products.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('category', form.category);
      data.append('stock', form.stock);
      if (imageFile) data.append('image', imageFile);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || 'Failed to create product');
      }

      setSuccess('Product created successfully.');
      setForm({ name: '', description: '', price: '', category: '', stock: '' });
      setImageFile(null);
      setPreview(null);
      // Optionally navigate to product or admin list
      setTimeout(() => navigate('/shop'), 900);
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shop-page">
      <div className="page-heading">
        <div>
          <h1>Add Product</h1>
          <p className="cart-summary">Create a new product for the store catalog.</p>
        </div>
      </div>

      <div className="cart-grid">
        <section className="cart-items-panel">
          <div className="summary-card">
            <h2>New Product</h2>
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} required />
              </div>

              <div className="form-row split-row">
                <div>
                  <label>Price (INR)</label>
                  <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
                </div>
                <div>
                  <label>Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <label>Category</label>
                <input name="category" value={form.category} onChange={handleChange} />
              </div>

              <div className="form-row">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImage} />
                {preview && (
                  <div style={{ marginTop: 12 }}>
                    <img src={preview} alt="preview" style={{ width: 180, borderRadius: 12 }} />
                  </div>
                )}
              </div>

              <div className="form-row">
                <button className="btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Product'}</button>
              </div>

              {error && <p style={{ color: '#f87171' }}>{error}</p>}
              {success && <p style={{ color: '#10b981' }}>{success}</p>}
            </form>
          </div>
        </section>

        <aside className="cart-summary-panel">
          <div className="summary-card">
            <h2>Help</h2>
            <p style={{ color: '#a1a1aa' }}>Provide a clear name, short description, price, and stock quantity. Upload a square image for best display.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddProduct;
