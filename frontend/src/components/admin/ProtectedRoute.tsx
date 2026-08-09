import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { Role } from '../../types/auth';
interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children: ReactNode;
}
/**
 * Bloque l'accès si l'utilisateur n'est pas connecté, ou n'a pas le bon rôle si allowedRoles est fourni.
 * Redirige vers /login si non connecté, ou vers / si le rôle ne correspond pas.
 * Si allowedRoles est omis, tout utilisateur connecté (quel que soit son rôle) est autorisé.
 */
export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}