import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Ban, CheckCircle2 } from 'lucide-react';
import { getUsers, enableUser, disableUser } from '../../services/adminService';
import type { PagedUsers } from '../../types/admin';

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  TECHNICIEN: 'Technicien',
  ENTREPRISE: 'Entreprise',
  STAGIAIRE: 'Stagiaire',
  BENEFICIEL: 'Bénéficiaire',
};

export default function UsersPanel() {
  const [pageData, setPageData] = useState<PagedUsers | null>(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback((p: number) => {
    setLoading(true);
    getUsers(p, 20)
      .then(setPageData)
      .catch(() => setError('Impossible de charger les utilisateurs.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  async function toggleEnabled(id: number, enabled: boolean) {
    setBusyId(id);
    try {
      if (enabled) {
        await disableUser(id);
      } else {
        await enableUser(id);
      }
      load(page);
    } catch {
      setError("Impossible de modifier le statut de l'utilisateur.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading && !pageData) {
    return <p className="text-navy/60">Chargement des utilisateurs…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!pageData) return null;

  return (
    <div className="rounded-xl border border-navy/10 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy/5 text-navy/70 text-left">
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Téléphone</th>
              <th className="px-4 py-3 font-semibold">Rôle</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.content.map((u) => (
              <tr key={u.id} className="border-t border-navy/5">
                <td className="px-4 py-3 text-navy">{u.prenom} {u.nom}</td>
                <td className="px-4 py-3 text-navy/80">{u.email}</td>
                <td className="px-4 py-3 text-navy/80">{u.phone}</td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-medium text-navy">
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {u.enabled ? 'Actif' : 'Désactivé'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleEnabled(u.id, u.enabled)}
                    disabled={busyId === u.id}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                      u.enabled
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {u.enabled ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                    {u.enabled ? 'Désactiver' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-navy/10 text-sm text-navy/60">
        <span>
          Page {pageData.number + 1} / {Math.max(pageData.totalPages, 1)} — {pageData.totalElements} utilisateurs
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={pageData.number === 0}
            className="grid place-items-center h-8 w-8 rounded-full border border-navy/10 hover:bg-navy/5 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setPage((p) => (p + 1 < pageData.totalPages ? p + 1 : p))}
            disabled={pageData.number + 1 >= pageData.totalPages}
            className="grid place-items-center h-8 w-8 rounded-full border border-navy/10 hover:bg-navy/5 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
