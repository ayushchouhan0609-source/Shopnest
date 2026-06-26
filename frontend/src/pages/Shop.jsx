import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to load products.');
        }
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        setError(err.message || 'Unable to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="shop-page">
      <div className="page-heading">
        <div>
          <h1>Shop</h1>
          <p className="cart-summary">Browse all products and add your favorites to the cart.</p>
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <div className="empty-cart-card">
          <h2>Unable to load products</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))
          ) : (
            <div className="empty-cart-card">
              <h2>No products available</h2>
              <p>Please check back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
