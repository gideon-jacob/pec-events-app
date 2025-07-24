import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextData = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    async function loadStoredData() {
      try {
        const [[, userData]] = await AsyncStorage.multiGet(['@Auth:user']);
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          api.defaults.headers.Authorization = `Bearer ${parsedUser.token}`;
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredData();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;

      setUser(userData);
      api.defaults.headers.Authorization = `Bearer ${token}`;

      await AsyncStorage.multiSet([
        ['@Auth:token', token],
        ['@Auth:user', JSON.stringify(userData)],
      ]);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post('/auth/register', { name, email, password });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call your backend logout endpoint if needed
      // await api.post('/auth/logout');
      
      // Clear local storage
      await AsyncStorage.multiRemove(['@Auth:token', '@Auth:user']);
      
      // Clear user state
      setUser(null);
      delete api.defaults.headers.Authorization;
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update user data
  const updateUser = async (userData: User) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(userData));
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
