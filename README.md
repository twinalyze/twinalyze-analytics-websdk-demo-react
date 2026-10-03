# Twinalyze React npm Events Test Store

A React + Vite ecommerce website prepared for testing the Twinalyze Web Analytics SDK through **npm**.

Direct `identify()` and `track()` calls are already placed in the application. SDK initialization, credentials, and the active FCM worker are intentionally **not configured**, so you can add them manually and document each integration step.

## What is already included

- React Router multi-page SPA
- Signup and login
- Cart and checkout
- Direct Twinalyze `identify()` calls after signup and login
- Email passed as the first `identify()` argument, so it becomes `identifyProperties.userId`
- Direct `addToCart` custom event
- Direct `beginCheckout` custom event
- Direct `purchaseCompleted` custom event
- Direct `testingLabAction` custom event
- Notification permission button
- Search, forms, file download, route navigation, and long-scroll test pages
- An inactive FCM worker example under `docs/snippets/`

## What is intentionally not configured

- No `TwinalyzeAnalytics.init()` call
- No API key or secret key
- No active FCM worker in `public/`
- No Firebase values or VAPID key
- No CDN script
- No `window.TwinalyzeAnalytics` calls
- No helper file such as `src/analytics/twinalyze.js`

The npm package is listed in `package.json`, so a normal `npm install` installs it.

---

## 1. Install dependencies

```bash
npm install
```

Verify Twinalyze:

```bash
npm list @twinalyze/web-analytics
```

For a locally packed SDK, replace the registry package:

```bash
npm uninstall @twinalyze/web-analytics
npm install "E:\\path\\to\\twinalyze-web-analytics-1.0.XX.tgz"
```

---

## 2. Add SDK initialization

Open:

```text
src/main.jsx
```

Add this import at the top:

```js
import TwinalyzeAnalytics from '@twinalyze/web-analytics';
```

Then add initialization **before** `createRoot(...).render(...)`:

```js
TwinalyzeAnalytics.init({
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID',

  persistSession: true,

  fcm: {
    enabled: true,
    configUrl: '/twinalyze-fcm-sw.js',
    serviceWorkerPath: '/twinalyze-fcm-sw.js',
  },

  enhancedMeasurement: {
    pageView: true,
    scrollDepth: true,
    elementClick: true,
    searchResultsView: {
      params: ['q', 's', 'search', 'query'],
    },
    formInteractions: true,
    fileDownloads: {
      extensions: [
        'pdf',
        'zip',
        'apk',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
      ],
    },
  },
});
```

The final structure of `main.jsx` should be:

```jsx
import TwinalyzeAnalytics from '@twinalyze/web-analytics';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import './styles.css';

TwinalyzeAnalytics.init({
  apiKey: 'YOUR_API_KEY',
  clientId: 'YOUR_CLIENT_ID',
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
```

Initialize only once. Do not add CDN code and do not initialize inside `useEffect()`.

---

## 3. Add the FCM worker

An inactive example is provided here:

```text
docs/snippets/twinalyze-fcm-sw.example.js
```

Copy it to:

```text
public/twinalyze-fcm-sw.js
```

Then replace the Firebase placeholders and VAPID key inside the copied file.

The worker must be accessible at:

```text
http://localhost:5173/twinalyze-fcm-sw.js
```

Do not import the worker into React and do not add it as an HTML `<script>`.

The notification permission button is located in:

```text
src/pages/TestingLabPage.jsx
```

It calls `Notification.requestPermission()` from a user click. After permission becomes `granted`, the initialized SDK can register the worker and sync the FCM token.

---

## 4. Existing identify calls

File:

```text
src/context/AuthContext.jsx
```

### Signup

```js
TwinalyzeAnalytics.identify(sessionUser.email, {
  name: sessionUser.name,
  internalUserId: sessionUser.id,
  accountType: 'customer',
  authenticationEvent: 'signup',
  signupSource: 'react_test_store',
  signupDate: sessionUser.createdAt,
});
```

### Login

```js
TwinalyzeAnalytics.identify(sessionUser.email, {
  name: sessionUser.name,
  internalUserId: sessionUser.id,
  accountType: 'customer',
  authenticationEvent: 'login',
  signupDate: sessionUser.createdAt,
  lastLoginAt: new Date().toISOString(),
});
```

Because email is the first argument, the SDK sends it as:

```json
{
  "identifyProperties": {
    "userId": "user@example.com"
  }
}
```

---

## 5. Existing manual events

### Add to cart

File:

```text
src/context/CartContext.jsx
```

Event:

```js
TwinalyzeAnalytics.track('addToCart', {
  productId: product.id,
  productName: product.name,
  category: product.category,
  price: product.price,
  quantity: safeQuantity,
  cartQuantity,
  currency: 'USD',
  source: 'react_test_store',
});
```

### Begin checkout

File:

```text
src/pages/CartPage.jsx
```

Event name:

```text
beginCheckout
```

### Purchase completed

File:

```text
src/pages/CheckoutPage.jsx
```

Event name:

```text
purchaseCompleted
```

It is called before the cart is cleared, so product and revenue data remain available.

### Testing Lab event

File:

```text
src/pages/TestingLabPage.jsx
```

Event name:

```text
testingLabAction
```

---

## 6. Run the website

```bash
npm start
```

Open:

```text
http://localhost:5173
```

Before initialization is added, direct SDK calls may be skipped or remain unsent. After initialization is added, test DevTools → Network for:

```text
/api/web/sdk/init
/api/web/sdk/identify
/api/web/sdk/eventsBatch
```

Expected tests:

| Website action | Expected SDK result |
|---|---|
| Open or refresh a page | `pageView` |
| Navigate between React routes | `pageView` |
| Signup | `identify` with email as `userId` |
| Login | `identify` with email as `userId` |
| Add a product | `addToCart` |
| Continue to checkout | `beginCheckout` |
| Complete checkout | `purchaseCompleted` |
| Click Testing Lab custom button | `testingLabAction` |
| Focus and submit forms | `formStart`, `formSubmit` |
| Update search query | `searchResultsView` |
| Download sample ZIP | `fileDownload` |
| Scroll beyond 90% | `scrollDepth` |
| Grant notifications | permission identify and FCM token identify |

---

## 7. Important rules

- Use npm or CDN, never both.
- Initialize Twinalyze only once.
- Keep the FCM worker at the website root.
- Use HTTPS in production; localhost is allowed for development.
- Do not create `src/analytics/twinalyze.js`; direct imports are already used.
- Do not replace direct imports with `window.TwinalyzeAnalytics` in the npm version.
