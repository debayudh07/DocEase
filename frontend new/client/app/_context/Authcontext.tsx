"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (userData: RegistrationData) => Promise<void>;
  clearError: () => void;
}

interface User {
  _id: string;
  name: string;
  contact_info: {
    email?: string;
    phone?: string;
  };
}

interface RegistrationData {
  name: string;
  contact_info: {
    email?: string;
    phone?: string;
  };
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = () => setError(null);

  const register = async (userData: RegistrationData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required fields
      const { name, contact_info, password } = userData;
      const { email, phone } = contact_info;

      if (!name || (!email && !phone) || !password) {
        throw new Error('Please provide all required fields');
      }

      // Basic email validation
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error('Please provide a valid email address');
        }
      }

      // Basic phone validation
      if (phone) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(phone)) {
          throw new Error('Please provide a valid phone number');
        }
      }

      const response = await axios.post('http://localhost:8000/api/v1/patients/register', userData);

      if (response.data.data) {
        setUser(response.data.data);
        // Redirect to KYC page after successful registration
        router.push('/kyc/user');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    register,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}