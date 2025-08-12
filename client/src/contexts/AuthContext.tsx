import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { User } from '@shared/schema';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: { username: string; email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; bio?: string; favoriteStyle?: string; favoriteFormat?: string }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Vérifier si l'utilisateur est connecté au démarrage
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Pour le développement, on désactive l'authentification
    // L'utilisateur peut naviguer librement sans se connecter
    setUser(null);
    setIsLoading(false);
  };

  const login = async (username: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      setUser(data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { username: string; email: string; password: string; firstName?: string; lastName?: string }) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur d\'inscription');
      }

      setUser(data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur d\'inscription';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur de déconnexion');
      }

      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de déconnexion';
      setError(errorMessage);
      throw err;
    }
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string; bio?: string; favoriteStyle?: string; favoriteFormat?: string }) => {
    try {
      setError(null);
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Erreur de mise à jour du profil');
      }

      setUser(responseData.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de mise à jour du profil';
      setError(errorMessage);
      throw err;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}