import { useState } from 'react';
import AuthContext from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setUser({ username: 'TestUser', role: 'ROLE_USER' });
  };

  const register = async (payload) => {
    setUser({ username: payload.username, role: 'ROLE_USER' });
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}