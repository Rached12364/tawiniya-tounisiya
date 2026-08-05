import { useEffect, useState } from 'react';
import { Users, ShieldAlert, UserCog } from 'lucide-react';
import { getStats } from '../../services/adminService';
import type { AdminStats } from '../../types/admin';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admins',
  TECHNICIEN: 'Techniciens',
  ENTREPRISE: 'Entreprises',
  STAGIAIRE: 'Stagiaires',
  BENEFICIEL: 'Bénéficiaires',
};

export default function StatsPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError('Impossible de charger les statistiques.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-navy/60">Chargement des statistiques…</p>;
  }

  if (error || !stats) {
    return <p className="text-red-600">{error ?? 'Erreur inconnue.'}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl border border-navy/10 bg-white p-5 flex items-center gap-4">
        <div className="grid place-items-center h-12 w-12 rounded-full bg-navy/10 text-navy">
          <Users size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold text-navy">{stats.totalUsers}</p>
          <p className="text-sm text-navy/60">Utilisateurs au total</p>
        </div>
      </div>

      <div className="rounded-xl border border-navy/10 bg-white p-5 flex items-center gap-4">
        <div className="grid place-items-center h-12 w-12 rounded-full bg-red-100 text-red-600">
          <ShieldAlert size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold text-navy">{stats.failedLoginAttempts}</p>
          <p className="text-sm text-navy/60">Connexions échouées</p>
        </div>
      </div>

      <div className="sm:col-span-2 lg:col-span-2 rounded-xl border border-navy/10 bg-white p-5">
        <div className="flex items-center gap-2 mb-3 text-navy">
          <UserCog size={18} />
          <p className="text-sm font-semibold">Répartition par rôle</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(stats.usersByRole).map(([role, count]) => (
            <div key={role} className="rounded-lg bg-navy/5 px-3 py-2">
              <p className="text-lg font-bold text-navy">{count}</p>
              <p className="text-xs text-navy/60">{ROLE_LABELS[role] ?? role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
