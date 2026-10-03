import { createContext, useContext, useMemo, useState } from 'react';
import TwinalyzeAnalytics from '@twinalyze/web-analytics';

const AuthContext = createContext(null);
const USER_KEY = 'novacart_user';
const REGISTERED_USERS_KEY = 'novacart_registered_users';

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

function readRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const signup = ({ name, email, password }) => {
    const users = readRegisteredUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((item) => item.email === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...users, newUser]));

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);

    // Direct npm SDK call. Email is used as the Twinalyze userId.
    TwinalyzeAnalytics.identify(sessionUser.email, {
      name: sessionUser.name,
      internalUserId: sessionUser.id,
      accountType: 'customer',
      authenticationEvent: 'signup',
      signupSource: 'react_test_store',
      signupDate: sessionUser.createdAt,
    });

    return sessionUser;
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readRegisteredUsers();
    const match = users.find(
      (item) => item.email === normalizedEmail && item.password === password,
    );

    if (!match) {
      throw new Error('Invalid email or password. Create an account first.');
    }

    const sessionUser = { ...match };
    delete sessionUser.password;
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);

    // Direct npm SDK call. Email is used as the Twinalyze userId.
    TwinalyzeAnalytics.identify(sessionUser.email, {
      name: sessionUser.name,
      internalUserId: sessionUser.id,
      accountType: 'customer',
      authenticationEvent: 'login',
      signupDate: sessionUser.createdAt,
      lastLoginAt: new Date().toISOString(),
    });

    return sessionUser;
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), signup, login, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
