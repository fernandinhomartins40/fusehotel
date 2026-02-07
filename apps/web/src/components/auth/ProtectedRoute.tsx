import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@fusehotel/shared';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = []
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redirecionar para home
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se allowedRoles foi especificado, verificar se o usuário tem permissão
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Usuário autenticado mas sem permissão - redirecionar para área do cliente
    return <Navigate to="/area-do-cliente" replace />;
  }

  // Usuário autenticado e com permissão adequada
  return <>{children}</>;
};
