import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>NovaCart React Test Store</strong>
        <p>A local ecommerce website designed for SDK integration testing.</p>
      </div>
      <div className="footer-links">
        <Link to="/products">Products</Link>
        <Link to="/testing-lab">Testing Lab</Link>
        <Link to="/login">Login</Link>
        <a href="/downloads/sample-download.zip" download>
          Sample download
        </a>
      </div>
    </footer>
  );
}
