import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Send, Loader2, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../services/authService';
import type { ApiError } from '../types/auth';
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err) && err.response) {
        setError(err.response.data.message || "Une erreur est survenue.");
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
        <h1 className="text-2xl font-black text-navy dark:text-white text-center">Mot de passe oublié</h1>
        <p className="mt-1.5 text-sm text-navy/50 dark:text-white/50 text-center">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>
        {sent ? (
          <div className="mt-8 text-center">
            <p className="text-sm text-navy dark:text-white">
              Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.
              Vérifiez votre boîte de réception (et vos spams).
            </p>
            <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline">
              <ArrowLeft size={15} /> Retour à la connexion
            </Link>
          </div>
        ) : (
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
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-60"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Envoyer le lien
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