import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);

  const orderTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0),
    [cartItems]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      // Simulated payment pause
      await new Promise((resolve) => setTimeout(resolve, 900));

      // Prepare order payload
      const items = cartItems.map((i) => ({ product: i._id, quantity: i.qty || 1, price: i.price || 0 }));
      const payload = {
        items,
        totalPrice: orderTotal,
        shippingAddress: {
          fullName: customer.fullName,
          street: customer.address,
          city: customer.city,
          postalCode: customer.postalCode,
          country: customer.country,
        },
        paymentId: 'N/A',
      };

      // Get token from localStorage (AuthContext stores user info there)
      const stored = JSON.parse(localStorage.getItem('userInfo') || 'null');
      const token = stored?.token;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(clearCart());
        navigate('/order-success');
      } else {
        alert(data.message || 'Order failed');
      }
    } catch (err) {
      console.error('Place order error:', err);
      alert('Order failed, check console');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-panel empty-checkout">
          <h1>Checkout</h1>
          <p>Your cart is empty. Add items before placing an order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-grid">
        <section className="checkout-panel">
          <h1>Checkout</h1>
          <p className="checkout-intro">Complete your order and enter shipping details below.</p>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={customer.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={customer.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="address">Street Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={customer.address}
                onChange={handleChange}
                placeholder="123 Main St"
                required
              />
            </div>

            <div className="form-row split-row">
              <div>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={customer.city}
                  onChange={handleChange}
                  placeholder="New Delhi"
                  required
                />
              </div>

              <div>
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={customer.postalCode}
                  onChange={handleChange}
                  placeholder="110001"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                value={customer.country}
                onChange={handleChange}
                placeholder="India"
                required
              />
            </div>

            <div className="form-row">
              <label>Payment Method</label>
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Debit / Credit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  UPI
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-full" disabled={submitting}>
              {submitting ? 'Placing order...' : `Place Order ₹${orderTotal.toFixed(2)}`}
            </button>
          </form>
        </section>

        <aside className="checkout-summary-panel">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{orderTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{orderTotal.toFixed(2)}</span>
            </div>
            <div className="checkout-item-list">
              {cartItems.map((item) => (
                <div className="checkout-item" key={item._id}>
                  <span>{item.name}</span>
                  <span>₹{((item.price || 0) * (item.qty || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
