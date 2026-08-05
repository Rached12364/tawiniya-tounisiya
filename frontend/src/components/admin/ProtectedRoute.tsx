import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../types/auth';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: ReactNode;
}

/**
 * Bloque l'accès si l'utilisateur n'est pas connecté ou n'a pas le bon rôle.
 * Redirige vers /login si non connecté, ou vers / si le rôle ne correspond pas.
 */
export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
