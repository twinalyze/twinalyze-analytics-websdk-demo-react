import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { products } from '../data/products.js';

export default function HomePage() {
  return (
    <>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <span className="eyebrow">REACT ECOMMERCE TEST WEBSITE</span>
          <h1>Every interaction you need for SDK testing.</h1>
          <p>
            Navigate routes, search products, complete forms, add items, sign in,
            checkout, download a file, and scroll through long content.
          </p>
          <div className="button-row">
            <Link className="button button-primary" to="/products">
              Explore products
            </Link>
            <Link className="button button-secondary" to="/testing-lab">
              Open testing lab
            </Link>
          </div>
          <div className="hero-stats">
            <div><strong>8</strong><span>Products</span></div>
            <div><strong>10+</strong><span>Routes and flows</span></div>
            <div><strong>0</strong><span>SDK scripts included</span></div>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-card visual-card-large">🛍️</div>
          <div className="visual-card visual-card-top">📦</div>
          <div className="visual-card visual-card-bottom">✨</div>
        </div>
      </section>

      <section className="feature-strip section-wrap">
        <article><span>01</span><h3>SPA navigation</h3><p>Browser history routes for page-view testing.</p></article>
        <article><span>02</span><h3>Real form flows</h3><p>Signup, login, checkout, and contact interactions.</p></article>
        <article><span>03</span><h3>Ecommerce actions</h3><p>Product views, cart changes, and completed orders.</p></article>
      </section>

      <section className="section-wrap content-section">
        <div className="section-heading">
          <div><span className="eyebrow">POPULAR NOW</span><h2>Featured products</h2></div>
          <Link to="/products">View all products →</Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-wrap promo-panel">
        <div>
          <span className="eyebrow">TEST MORE THAN PAGE VIEWS</span>
          <h2>Use the testing lab for forms, search, downloads, and scroll depth.</h2>
        </div>
        <Link className="button button-light" to="/testing-lab">
          Start testing
        </Link>
      </section>
    </>
  );
}
