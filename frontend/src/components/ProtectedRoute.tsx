import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Se ainda está carregando, exibe um indicador de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se roles for fornecido, verifica se o usuário tem a role necessária
  if (roles && user && !roles.includes(user.role)) {
    // Redireciona para uma página de acesso negado ou para a página inicial
    return <Navigate to="/acesso-negado" replace />;
  }

  // Se estiver autenticado e tiver as permissões necessárias, renderiza o conteúdo da rota
  return <>{children}</>;
};

export default ProtectedRoute;