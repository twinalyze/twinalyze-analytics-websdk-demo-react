import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import TwinalyzeAnalytics from '@twinalyze/web-analytics';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  const handleBeginCheckout = () => {
    TwinalyzeAnalytics.track('beginCheckout', {
      currency: 'USD',
      value: subtotal,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      products: items.map(({ product, quantity }) => ({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
      })),
    });
  };

  if (!items.length) {
    return (
      <section className="section-wrap page-section empty-state">
        <span>🛒</span>
        <h1>Your cart is empty</h1>
        <p>Add a product to begin the ecommerce test flow.</p>
        <Link className="button button-primary" to="/products">Browse products</Link>
      </section>
    );
  }

  return (
    <section className="section-wrap page-section">
      <div className="page-heading"><span className="eyebrow">YOUR SELECTION</span><h1>Shopping cart</h1></div>
      <div className="cart-layout">
        <div className="cart-list">
          {items.map(({ product, quantity }) => (
            <article className="cart-item" key={product.id}>
              <div className="cart-item-art">{product.emoji}</div>
              <div className="cart-item-info">
                <Link to={`/products/${product.id}`}>{product.name}</Link>
                <span>${product.price} each</span>
                <button onClick={() => removeItem(product.id)}>Remove</button>
              </div>
              <label>
                Qty
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={quantity}
                  onChange={(event) => updateQuantity(product.id, event.target.value)}
                />
              </label>
              <strong>${product.price * quantity}</strong>
            </article>
          ))}
        </div>
        <aside className="summary-card">
          <h2>Order summary</h2>
          <div><span>Subtotal</span><strong>${subtotal}</strong></div>
          <div><span>Shipping</span><strong>Free</strong></div>
          <div className="summary-total"><span>Total</span><strong>${subtotal}</strong></div>
          <Link
            className="button button-primary button-full"
            to="/checkout"
            onClick={handleBeginCheckout}
          >
            Continue to checkout
          </Link>
          <Link className="text-link" to="/products">Continue shopping</Link>
        </aside>
      </div>
    </section>
  );
}
