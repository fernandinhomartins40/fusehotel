
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PublicUser } from '@fusehotel/shared';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  user: PublicUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: PublicUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authVerified, setAuthVerified] = useState(false);

  useEffect(() => {
    // Prevenir múltiplas verificações simultâneas
    if (authVerified) {
      return;
    }

    // Recuperar usuário do localStorage na inicialização
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }

    // Verificar se usuário está autenticado através do cookie (httpOnly)
    // Tentar buscar perfil do usuário se houver cookie
    const verifyAuth = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        if (response.data?.data) {
          setUser(response.data.data);
          localStorage.setItem('user', JSON.stringify(response.data.data));
        }
      } catch (error) {
        // Se falhar, limpar dados locais
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setIsLoading(false);
        setAuthVerified(true);
      }
    };

    if (!storedUser) {
      verifyAuth();
    } else {
      setIsLoading(false);
      setAuthVerified(true);
    }
  }, [authVerified]);

  const logout = async () => {
    try {
      // Backend limpará os cookies httpOnly automaticamente
      await apiClient.post('/auth/logout', {});
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Limpar estado e localStorage independentemente do resultado da API
      setUser(null);
      localStorage.removeItem('user');
      setAuthVerified(false);
      // Remover dados de "lembrar email" opcionalmente
      // localStorage.removeItem('fusehotel_remember_email');
      // localStorage.removeItem('fusehotel_remember_me');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
