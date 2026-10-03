import { createContext, useContext, useMemo, useState } from 'react';
import TwinalyzeAnalytics from '@twinalyze/web-analytics';

const CartContext = createContext(null);
const CART_KEY = 'novacart_cart';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  const persist = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
  };

  const addItem = (product, quantity = 1) => {
    const safeQuantity = Number(quantity) || 1;
    const existing = items.find((item) => item.product.id === product.id);
    const cartQuantity = existing ? existing.quantity + safeQuantity : safeQuantity;

    if (existing) {
      persist(
        items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: cartQuantity }
            : item,
        ),
      );
    } else {
      persist([...items, { product, quantity: safeQuantity }]);
    }

    // Direct npm SDK manual ecommerce event.
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
  };

  const updateQuantity = (productId, quantity) => {
    const numericQuantity = Number(quantity);
    if (!Number.isFinite(numericQuantity) || numericQuantity < 1) return;

    persist(
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity: numericQuantity } : item,
      ),
    );
  };

  const removeItem = (productId) => {
    persist(items.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => persist([]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      subtotal,
    }),
    [items, itemCount, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
