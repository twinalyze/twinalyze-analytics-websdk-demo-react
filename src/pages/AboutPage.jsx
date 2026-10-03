import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <section className="section-wrap page-section about-page">
      <div className="page-heading"><span className="eyebrow">ABOUT THIS PROJECT</span><h1>Built for repeatable integration testing.</h1><p>The project is intentionally self-contained and uses browser storage instead of a backend.</p></div>
      <div className="about-grid">
        <article><span>⚛️</span><h2>React + Vite</h2><p>A modern client-side React application with BrowserRouter navigation.</p></article>
        <article><span>🧪</span><h2>Testing-friendly</h2><p>Pages and controls cover common automatic and manual analytics events.</p></article>
        <article><span>🔌</span><h2>SDK-free starting point</h2><p>No Twinalyze CDN, initialization, or service worker is preconfigured.</p></article>
      </div>
      <div className="promo-panel compact-promo"><div><h2>Ready to start?</h2><p>Run the website first, then add your CDN integration manually.</p></div><Link className="button button-light" to="/testing-lab">Open Testing Lab</Link></div>
    </section>
  );
}
