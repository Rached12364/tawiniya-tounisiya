import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, Lock, UserPlus, Loader2 } from 'lucide-react';
import { register } from '../services/authService';
import { useAuthStore, redirectPathForRole } from '../store/authStore';
import type { ApiError, Role } from '../types/auth';
// L'ADMIN n'est jamais proposé dans un formulaire public — voir note en fin de fichier.
const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'TECHNICIEN', label: 'Technicien' },
  { value: 'ENTREPRISE', label: 'Entreprise' },
  { value: 'STAGIAIRE', label: 'Stagiaire' },
  { value: 'BENEFICIEL', label: 'Bénéficiel' },
];
export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    password: '',
    role: 'TECHNICIEN' as Role,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);
    try {
      const { token, user } = await register(form);
      setAuth(token, user);
      navigate(redirectPathForRole(user.role));
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err) && err.response) {
        setError(err.response.data.message || "Impossible de créer le compte.");
        if (err.response.data.fieldErrors) {
          setFieldErrors(err.response.data.fieldErrors);
        }
      } else {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-navy/[0.02]">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-black text-navy text-center">Créer un compte</h1>
        <p className="mt-1.5 text-sm text-navy/50 text-center">
          Rejoignez la plateforme selon votre profil.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Nom</label>
              <div className="relative">
                <User size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
                <input
                  required
                  value={form.nom}
                  onChange={update('nom')}
                  className="w-full rounded-lg border border-navy/15 ps-10 pe-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                />
              </div>
              {fieldErrors.nom && <p className="mt-1 text-xs text-red-600">{fieldErrors.nom}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Prénom</label>
              <input
                required
                value={form.prenom}
                onChange={update('prenom')}
                className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
              {fieldErrors.prenom && <p className="mt-1 text-xs text-red-600">{fieldErrors.prenom}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Email</label>
            <div className="relative">
              <Mail size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
              <input
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                className="w-full rounded-lg border border-navy/15 ps-10 pe-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
              />
            </div>
            {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Téléphone</label>
              <div className="relative">
                <Phone size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
                <input
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="+216 ..."
                  className="w-full rounded-lg border border-navy/15 ps-10 pe-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="6 caractères min."
                  className="w-full rounded-lg border border-navy/15 ps-10 pe-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                />
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1.5">Vous êtes...</label>
            <select
              value={form.role}
              onChange={update('role')}
              className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal bg-white"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            Créer mon compte
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-navy/60">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-teal font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
// Le rôle ADMIN n'est volontairement PAS proposé ici : n'importe qui pourrait sinon
// s'auto-attribuer les droits d'administration via ce formulaire public. Un compte admin
// doit être créé directement en base (voir instructions ci-dessous) ou via un futur
// endpoint protégé réservé aux admins existants.
