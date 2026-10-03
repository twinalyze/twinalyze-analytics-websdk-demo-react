import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <section className="section-wrap page-section">
      <div className="account-hero">
        <div className="account-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div><span className="eyebrow">LOCAL TEST PROFILE</span><h1>Hello, {user.name}</h1><p>{user.email}</p></div>
      </div>
      <div className="account-grid">
        <article className="info-card"><span>User ID</span><strong>{user.id}</strong><p>Useful as the identify user ID during SDK testing.</p></article>
        <article className="info-card"><span>Account created</span><strong>{new Date(user.createdAt).toLocaleString()}</strong><p>Stored locally in this browser.</p></article>
        <article className="info-card"><span>Next action</span><strong>Complete an order</strong><p>Continue through cart and checkout.</p><Link to="/products">Shop now →</Link></article>
      </div>
    </section>
  );
}
