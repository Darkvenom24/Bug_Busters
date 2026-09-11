import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService, DEMO_USERS } from '../services/authService';

interface AuthContextType {
  user: User;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(authService.getCurrentUser());

  useEffect(() => {
    const handleRoleChanged = (e: Event) => {
      const customEvent = e as CustomEvent<User>;
      if (customEvent.detail) {
        setUser(customEvent.detail);
      }
    };
    window.addEventListener('farmsetu:role_changed', handleRoleChanged);
    return () => window.removeEventListener('farmsetu:role_changed', handleRoleChanged);
  }, []);

  const switchRole = (role: UserRole) => {
    const updated = authService.switchRole(role);
    setUser(updated);
  };

  const login = (role: UserRole) => {
    switchRole(role);
  };

  const logout = () => {
    authService.logout();
    setUser(DEMO_USERS.farmer);
  };

  return (
    <AuthContext.Provider value={{ user, role: user.role, switchRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
