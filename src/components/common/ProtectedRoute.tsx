import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { usuario, loading } = useAuth();
  const location = useLocation();

  // Se ainda estiver carregando, não renderiza nada
  if (loading) {
    return null;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se a rota for somente para admin e o usuário não for admin, redireciona para a home
  if (adminOnly && !usuario.adm) {
    return <Navigate to="/" replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo normal
  return <>{children}</>;
};

export default ProtectedRoute; 