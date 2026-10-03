import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      login({ email: form.get('email'), password: form.get('password') });
      navigate(location.state?.from || '/account');
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  return (
    <section className="auth-page section-wrap">
      <div className="auth-panel auth-visual-panel">
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Continue your test shopping journey.</h1>
        <p>Login submits a real form and creates a local browser session.</p>
        <div className="auth-art">🔐</div>
      </div>
      <form className="auth-panel form-card" name="loginForm" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p>Use an account created from the signup page.</p>
        {error && <div className="form-alert">{error}</div>}
        <label>Email<input name="email" type="email" placeholder="you@example.com" required /></label>
        <label>Password<input name="password" type="password" minLength="6" required /></label>
        <button className="button button-primary button-full" type="submit">Login</button>
        <p className="form-footer">New here? <Link to="/signup">Create an account</Link></p>
      </form>
    </section>
  );
}
