import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      signup({ name: form.get('name'), email: form.get('email'), password });
      navigate('/account');
    } catch (signupError) {
      setError(signupError.message);
    }
  };

  return (
    <section className="auth-page section-wrap">
      <div className="auth-panel auth-visual-panel signup-visual">
        <span className="eyebrow">CREATE AN ACCOUNT</span>
        <h1>Test signup, identify, and authenticated routes.</h1>
        <p>Accounts are saved only in your browser localStorage.</p>
        <div className="auth-art">👤</div>
      </div>
      <form className="auth-panel form-card" name="signupForm" onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <p>Create a local testing account.</p>
        {error && <div className="form-alert">{error}</div>}
        <label>Full name<input name="name" placeholder="Test User" required /></label>
        <label>Email<input name="email" type="email" placeholder="test@example.com" required /></label>
        <label>Password<input name="password" type="password" minLength="6" required /></label>
        <label>Confirm password<input name="confirmPassword" type="password" minLength="6" required /></label>
        <label className="checkbox-row"><input type="checkbox" required /> I agree to create a local test account.</label>
        <button className="button button-primary button-full" type="submit">Create account</button>
        <p className="form-footer">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </section>
  );
}
