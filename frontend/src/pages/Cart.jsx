import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart, clearCart } from '../redux/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const handleQtyChange = (item, value) => {
    const qty = Number(value);
    if (qty < 1) return;
    dispatch(addToCart({ ...item, qty }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    if (window.confirm('Remove all items from your cart?')) {
      dispatch(clearCart());
    }
  };

  const itemCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

  return (
    <div className="cart-page">
      <div className="page-heading">
        <div>
          <h1>Shopping Cart</h1>
          <p className="cart-summary">{itemCount} item{itemCount === 1 ? '' : 's'} in your bag</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart-card">
          <h2>Your cart is empty</h2>
          <p>Browse the store to add your favorite products.</p>
          <Link to="/shop" className="btn">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <section className="cart-items-panel">
            <div className="cart-panel-header">
              <h2>Cart Items</h2>
              <button onClick={handleClearCart} className="btn btn-secondary">Clear Cart</button>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => {
                const imageSrc = item.imageUrl && item.imageUrl.startsWith('http')
                  ? item.imageUrl
                  : 'https://via.placeholder.com/300x220?text=No+Image';

                return (
                  <article className="cart-item" key={item._id}>
                    <div className="cart-item-image">
                      <img src={imageSrc} alt={item.name} />
                    </div>

                    <div className="cart-item-details">
                      <Link to={`/product/${item._id}`} className="cart-item-name">
                        {item.name}
                      </Link>
                      <p className="cart-item-price">₹{(item.price || 0).toFixed(2)}</p>

                      <div className="cart-item-controls">
                        <label htmlFor={`qty-${item._id}`}>Qty</label>
                        <input
                          id={`qty-${item._id}`}
                          type="number"
                          min="1"
                          value={item.qty || 1}
                          onChange={(e) => handleQtyChange(item, e.target.value)}
                          className="cart-qty-input"
                        />
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <p className="cart-item-subtotal">
                        ₹{((item.price || 0) * (item.qty || 1)).toFixed(2)}
                      </p>
                      <button onClick={() => handleRemove(item._id)} className="btn btn-danger">
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="cart-summary-panel">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <p className="summary-note">Shipping, taxes, and discounts will be added at checkout.</p>
              <Link to="/checkout" className="btn btn-full">
                Proceed to Checkout
              </Link>
              <Link to="/shop" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
