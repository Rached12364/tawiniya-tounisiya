import { create } from 'zustand';
import type { User } from '../types/auth';
const TOKEN_KEY = 'tawiniya-token';
const USER_KEY = 'tawiniya-user';
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}
function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
export const useAuthStore = create<AuthState>((set) => ({
  user: loadStoredUser(),
  token: localStorage.getItem(TOKEN_KEY),
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  setAuth: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
/** Chemin de redirection après connexion, selon le rôle. */
export function redirectPathForRole(role: User['role']): string {
  if (role === 'ADMIN') {
    return '/admin';
  }
  if (role === 'EXPERT_JURIDIQUE') {
    return '/expert-juridique';
  }
  return '/';
}

