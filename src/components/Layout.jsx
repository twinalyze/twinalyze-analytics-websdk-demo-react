import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const pageTitles = {
  '/': 'Home',
  '/products': 'Products',
  '/cart': 'Cart',
  '/checkout': 'Checkout',
  '/login': 'Login',
  '/signup': 'Sign Up',
  '/account': 'Account',
  '/testing-lab': 'Testing Lab',
  '/about': 'About',
};

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    const title = location.pathname.startsWith('/products/')
      ? 'Product Details'
      : pageTitles[location.pathname] || 'Page';

    document.title = `${title} | NovaCart React Test Store`;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
