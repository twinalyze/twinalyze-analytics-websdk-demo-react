import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  };

  return (
    <article className="product-card">
      <Link className="product-art" to={`/products/${product.id}`}>
        <span>{product.emoji}</span>
        <small>{product.category}</small>
      </Link>
      <div className="product-card-body">
        <div className="product-meta">
          <span>★ {product.rating}</span>
          <span>{product.stock} in stock</span>
        </div>
        <Link to={`/products/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <p>{product.shortDescription}</p>
        <div className="product-card-footer">
          <strong>${product.price}</strong>
          <button className="button button-dark button-small" onClick={handleAdd}>
            {added ? 'Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
