export type Role = 'ADMIN' | 'TECHNICIEN' | 'ENTREPRISE' | 'STAGIAIRE' | 'BENEFICIEL';
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  fieldErrors: Record<string, string> | null;
}
