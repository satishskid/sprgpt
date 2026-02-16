import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        setUserData({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName || user.firstName,
          image: user.imageUrl,
        });
      } else {
        setUserData(null);
      }
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user]);

  const logout = () => {
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user: userData, 
      loading: loading || !isLoaded,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
