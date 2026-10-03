import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './styles.css';
import TwinalyzeAnalytics from '@twinalyze/web-analytics';


TwinalyzeAnalytics.init({
  apiKey: 'ADD YOUR PROJECT API KEY HERE',
  clientId: 'ADD YOUR CLIENT ID HERE',
  persistSession: true,
  fcm: {
    enabled: true,
    configUrl: '/twinalyze-fcm-sw.js',
    serviceWorkerPath: '/twinalyze-fcm-sw.js',
  },
});

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>,
);
