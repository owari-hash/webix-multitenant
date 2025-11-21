'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

// ----------------------------------------------------------------------

type UserType = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: string;
  isPremium: boolean;
} | null;

type AuthContextType = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  checkUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
};

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Verify token and get user data
      // Note: Adjust the API endpoint as needed based on your backend
      const response = await fetch('/api2/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.user || data;
        
        setUser({
          id: userData._id || userData.id,
          displayName: userData.displayName || userData.name || userData.username,
          email: userData.email,
          photoURL: userData.photoURL || userData.avatarUrl,
          role: userData.role,
          isPremium: userData.premium || userData.isPremium || false,
        });
      } else {
        setUser(null);
        // localStorage.removeItem('token'); // Optional: clear invalid token
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const memoizedValue = useMemo(
    () => ({
      user,
      loading,
      authenticated: !!user,
      checkUser,
    }),
    [user, loading, checkUser]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
