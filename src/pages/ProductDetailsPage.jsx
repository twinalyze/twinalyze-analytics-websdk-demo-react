import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return (
      <section className="section-wrap page-section empty-state">
        <span>📭</span><h1>Product not found</h1>
        <Link className="button button-primary" to="/products">Back to products</Link>
      </section>
    );
  }

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1000);
  };

  return (
    <section className="section-wrap page-section">
      <nav className="breadcrumbs">
        <Link to="/">Home</Link><span>/</span><Link to="/products">Products</Link><span>/</span>{product.name}
      </nav>

      <div className="product-detail-grid">
        <div className="product-detail-art">
          <span>{product.emoji}</span>
          <small>{product.category}</small>
        </div>
        <div className="product-detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-rating">★ {product.rating} · {product.stock} available</div>
          <p>{product.description}</p>
          <ul className="feature-list">
            {product.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          <div className="detail-price">${product.price}</div>
          <div className="quantity-row">
            <label>
              Quantity
              <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
                {[1, 2, 3, 4, 5].map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
            <button className="button button-primary" onClick={handleAdd}>
              {added ? 'Added to cart' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
