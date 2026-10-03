import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import TwinalyzeAnalytics from '@twinalyze/web-analytics';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [complete, setComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextOrderId = `ORD-${Date.now().toString().slice(-8)}`;

    // Twinalyze custom purchase event is sent before the cart is cleared.
    TwinalyzeAnalytics.track('purchaseCompleted', {
      orderId: nextOrderId,
      userId: user.email,
      currency: 'USD',
      revenue: subtotal,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      products: items.map(({ product, quantity }) => ({
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: product.price,
        quantity,
      })),
    });

    setOrderId(nextOrderId);
    setComplete(true);
    clearCart();
  };

  if (complete) {
    return (
      <section className="section-wrap page-section empty-state success-state">
        <span>✅</span>
        <h1>Order completed</h1>
        <p>Thank you, {user.name}. Your test order ID is <strong>{orderId}</strong>.</p>
        <Link className="button button-primary" to="/products">Continue shopping</Link>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="section-wrap page-section empty-state">
        <span>📦</span><h1>No items to checkout</h1>
        <Link className="button button-primary" to="/products">Add products</Link>
      </section>
    );
  }

  return (
    <section className="section-wrap page-section">
      <div className="page-heading"><span className="eyebrow">SECURE TEST CHECKOUT</span><h1>Checkout</h1></div>
      <div className="checkout-layout">
        <form className="form-card" name="checkoutForm" onSubmit={handleSubmit}>
          <h2>Shipping details</h2>
          <div className="form-grid">
            <label>Full name<input name="fullName" defaultValue={user.name} required /></label>
            <label>Email<input name="email" type="email" defaultValue={user.email} required /></label>
            <label className="form-span">Address<input name="address" placeholder="123 Test Street" required /></label>
            <label>City<input name="city" placeholder="Ahmedabad" required /></label>
            <label>Postal code<input name="postalCode" inputMode="numeric" placeholder="380001" required /></label>
          </div>
          <h2>Payment details</h2>
          <div className="form-grid">
            <label className="form-span">Card number<input name="cardNumber" inputMode="numeric" defaultValue="4242 4242 4242 4242" required /></label>
            <label>Expiry<input name="expiry" defaultValue="12/30" required /></label>
            <label>CVV<input name="cvv" type="password" defaultValue="123" required /></label>
          </div>
          <label className="checkbox-row"><input type="checkbox" required /> I confirm this is a local test order.</label>
          <button className="button button-primary button-full" type="submit">Place test order · ${subtotal}</button>
        </form>
        <aside className="summary-card checkout-summary">
          <h2>Your order</h2>
          {items.map(({ product, quantity }) => (
            <div key={product.id}><span>{product.name} × {quantity}</span><strong>${product.price * quantity}</strong></div>
          ))}
          <div className="summary-total"><span>Total</span><strong>${subtotal}</strong></div>
        </aside>
      </div>
    </section>
  );
}
