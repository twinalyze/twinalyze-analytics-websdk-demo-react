import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="section-wrap page-section empty-state">
      <span>404</span><h1>Page not found</h1><p>The requested test route does not exist.</p>
      <Link className="button button-primary" to="/">Return home</Link>
    </section>
  );
}
