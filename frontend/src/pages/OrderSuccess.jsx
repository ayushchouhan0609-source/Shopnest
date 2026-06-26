import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order || null;

  if (!order) {
    return (
      <div className="shop-page">
        <div className="empty-cart-card">
          <h2>Order Placed</h2>
          <p>Your order was placed successfully.</p>
          <p>If you expected to see order details, they may be available on your profile.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
            <Link to="/" className="btn">Home</Link>
            <Link to="/profile" className="btn btn-secondary">My Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  const { _id, totalAmount, products = [], createdAt } = order;

  return (
    <div className="shop-page">
      <div className="page-heading">
        <div>
          <h1>Thank you — Order Confirmed</h1>
          <p className="cart-summary">We received your order. A confirmation email has been sent.</p>
        </div>
      </div>

      <div className="cart-grid">
        <section className="cart-items-panel">
          <div className="summary-card">
            <h2>Order Details</h2>
            <div style={{ marginBottom: 12 }}>
              <div style={{ color: '#a1a1aa' }}>Order ID</div>
              <div style={{ fontWeight: 700, marginTop: 6 }}>{_id}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ color: '#a1a1aa' }}>Placed</div>
              <div>{createdAt ? new Date(createdAt).toLocaleString() : '-'}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ color: '#a1a1aa' }}>Total Paid</div>
              <div style={{ fontWeight: 700 }}>₹{(totalAmount || 0).toFixed(2)}</div>
            </div>

            <h3 style={{ marginTop: 18 }}>Items</h3>
            <div className="checkout-item-list">
              {products.map((p, idx) => (
                <div key={idx} className="checkout-item">
                  <span style={{ minWidth: 0 }}>{p.name || p.productName || 'Product'}</span>
                  <span>₹{((p.price || p.product?.price || 0) * (p.quantity || p.qty || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <Link to="/" className="btn">Continue Shopping</Link>
              <Link to="/profile" className="btn btn-secondary">View My Orders</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderSuccess;
