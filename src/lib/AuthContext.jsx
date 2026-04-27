import React, { createContext, useContext } from 'react';

const localUser = {
  id: 'local-admin',
  email: 'local@hearh.static',
  full_name: 'Local Admin',
  role: 'admin'
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const value = {
    user: localUser,
    isAuthenticated: true,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authChecked: true,
    authError: null,
    appPublicSettings: {},
    logout: () => {},
    navigateToLogin: () => {},
    checkUserAuth: async () => localUser,
    checkAppState: async () => ({})
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
