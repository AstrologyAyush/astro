
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  savedCharts?: any[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('ayushAstroUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        localStorage.removeItem('ayushAstroUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, accept any credentials
      // In production, this would validate against a backend API
      const mockUser = {
        id: '1',
        name: email.split('@')[0],
        email,
        savedCharts: []
      };
      
      setUser(mockUser);
      setIsLoggedIn(true);
      localStorage.setItem('ayushAstroUser', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('ayushAstroUser');
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // For demo purposes, just pretend to register
      // In production, this would create a new user via API
      const mockUser = {
        id: Date.now().toString(),
        name,
        email,
        savedCharts: []
      };
      
      setUser(mockUser);
      setIsLoggedIn(true);
      localStorage.setItem('ayushAstroUser', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
