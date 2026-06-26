import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const token = (() => {
    try {
      const data = JSON.parse(localStorage.getItem('userInfo'));
      return data?.token;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to load product');
        const data = await res.json();
        setProduct(data);
        setForm({
          name: data.name || '',
          description: data.description || '',
          price: data.price || '',
          category: data.category || '',
          stock: data.stock || '',
        });
        setPreview(data.imageUrl || null);
      } catch (err) {
        setError(err.message || 'Unable to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

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
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('category', form.category);
      data.append('stock', form.stock);
      if (imageFile) data.append('image', imageFile);

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update product');

      alert('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Server error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading product...</div>;
  if (error) return <div style={{ padding: 40, color: '#f87171' }}>{error}</div>;
  if (!product) return <div style={{ padding: 40 }}>Product not found</div>;

  return (
    <div className="shop-page">
      <div className="page-heading">
        <div>
          <h1>Edit Product</h1>
          <p className="cart-summary">Update product details and image.</p>
        </div>
      </div>

      <div className="cart-grid">
        <section className="cart-items-panel">
          <div className="summary-card">
            <h2>Edit {product.name}</h2>
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
                <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Product'}</button>
              </div>
            </form>
          </div>
        </section>

        <aside className="cart-summary-panel">
          <div className="summary-card">
            <h2>Original</h2>
            <img src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} style={{ width: '100%', borderRadius: 12 }} />
            <p style={{ marginTop: 12 }}>{product.description}</p>
            <div style={{ marginTop: 8 }}>Price: ₹{(product.price || 0).toFixed(2)}</div>
            <div>Stock: {product.stock}</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditProducts;
