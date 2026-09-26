import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Lock, Check, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../services/authService';
import type { ApiError } from '../types/auth';
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!token) {
      setError('Lien de réinitialisation invalide ou incomplet.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err) && err.response) {
        setError(err.response.data.message || "Ce lien n'est plus valide.");
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
        <h1 className="text-2xl font-black text-navy dark:text-white text-center">Nouveau mot de passe</h1>
        <p className="mt-1.5 text-sm text-navy/50 dark:text-white/50 text-center">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
        {!token && (
          <p className="mt-6 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2 text-center">
            Ce lien est invalide ou incomplet. Redemandez une réinitialisation.
          </p>
        )}
        {done ? (
          <div className="mt-8 text-center">
            <p className="text-sm text-navy dark:text-white">
              Votre mot de passe a été réinitialisé avec succès. Redirection vers la connexion...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-navy dark:text-white mb-1.5">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30 dark:text-white/30" />
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy dark:text-white mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30 dark:text-white/30" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-navy/15 dark:border-white/15 bg-transparent ps-10 pe-3 py-2.5 text-sm text-navy dark:text-white placeholder:text-navy/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading || !token}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-60"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Réinitialiser le mot de passe
            </button>
            <Link to="/login" className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-navy/60 dark:text-white/60 hover:text-teal transition-colors">
              <ArrowLeft size={15} /> Retour à la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}