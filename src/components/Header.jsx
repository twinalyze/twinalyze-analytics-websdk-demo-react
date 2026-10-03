import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" to="/" aria-label="NovaCart home">
          <span className="brand-mark">N</span>
          <span>
            <strong>NovaCart</strong>
            <small>React Test Store</small>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/testing-lab">Testing Lab</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="header-actions">
          <NavLink className="cart-link" to="/cart">
            Cart <span>{itemCount}</span>
          </NavLink>

          {user ? (
            <>
              <NavLink className="user-link" to="/account">
                {user.name.split(' ')[0]}
              </NavLink>
              <button className="button button-ghost button-small" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink className="button button-primary button-small" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
