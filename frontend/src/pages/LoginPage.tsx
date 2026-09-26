import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, LogIn, Loader2, Eye, EyeOff } from 'lucide-react';
import { login } from '../services/authService';
import { useAuthStore, redirectPathForRole } from '../store/authStore';
import type { ApiError } from '../types/auth';
export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { token, user } = await login({ email, password });
      setAuth(token, user);
      navigate(redirectPathForRole(user.role));
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err) && err.response) {
        setError(err.response.data.message || 'Email ou mot de passe incorrect.');
      } else {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-navy/[0.02] dark:bg-transparent">
      <div className="w-full max-w-md bg-white dark:bg-[#12283F] rounded-2xl shadow-lg dark:shadow-black/40 p-8">
        <h1 className="text-2xl font-black text-navy dark:text-white text-center">Connexion</h1>
        <p className="mt-1.5 text-sm text-navy/50 dark:text-white/50 text-center">
          Accédez à votre espace personnel.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-navy dark:text-white mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30 dark:text-white/30" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="w-full rounded-lg border border-navy/15 dark:border-white/15 bg-transparent ps-10 pe-3 py-2.5 text-sm text-navy dark:text-white placeholder:text-navy/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-navy dark:text-white">
                Mot de passe
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-teal hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30 dark:text-white/30" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-navy/15 dark:border-white/15 bg-transparent ps-10 pe-10 py-2.5 text-sm text-navy dark:text-white placeholder:text-navy/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-navy/30 dark:text-white/30 hover:text-navy/60 dark:hover:text-white/60 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            Se connecter
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-navy/60 dark:text-white/60">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-teal font-semibold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
