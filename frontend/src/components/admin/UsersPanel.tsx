import { Fragment, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Ban, CheckCircle2, ChevronDown } from 'lucide-react';
import { getUsers, enableUser, disableUser } from '../../services/adminService';
import type { PagedUsers } from '../../types/admin';
import type { User } from '../../types/auth';
const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  TECHNICIEN: 'Technicien',
  ENTREPRISE: 'Entreprise',
  STAGIAIRE: 'Stagiaire',
  BENEFICIEL: 'Bénéficiaire',
};
function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-navy/40 font-semibold">{label}</p>
      <p className="text-sm text-navy">{value === null || value === undefined || value === '' ? '—' : value}</p>
    </div>
  );
}
function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-navy/10 bg-navy/[0.02] p-3">
      <p className="text-xs font-bold text-teal mb-2">{title}</p>
      <div className="grid sm:grid-cols-3 gap-3">{children}</div>
    </div>
  );
}
function TechnicienDetail({ u }: { u: User }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <DetailSection title="Identité">
        <Field label="Date de naissance" value={u.dateNaissance} />
        <Field label="CIN" value={u.cin} />
        <Field label="Nom parent" value={u.nomParent} />
        <Field label="Adresse" value={u.adresse} />
      </DetailSection>
      <DetailSection title="Contacts">
        <Field label="GSM" value={u.phone} />
        <Field label="GSM (parent)" value={u.gsmParent} />
        <Field label="GSM (binôme)" value={u.gsmBinome} />
        <Field label="Email" value={u.email} />
        <Field label="Facebook" value={u.facebook} />
        <Field label="TikTok" value={u.tiktok} />
        <Field label="Instagram" value={u.instagram} />
      </DetailSection>
      <DetailSection title="Formation">
        <Field label="Diplôme" value={u.diplome} />
        <Field label="Spécialité" value={u.specialite} />
        <Field label="Niveau scolaire" value={u.niveauScolaire} />
        <Field label="Permis de conduire" value={u.permisConduire} />
      </DetailSection>
      <DetailSection title="Contrat & administratif">
        <Field label="Type de contrat" value={u.typeContrat} />
        <Field label="N° CNSS" value={u.numCnss} />
        <Field label="N° D17" value={u.numD17} />
        <Field label="Numéro banque / poste" value={u.numeroBanque} />
      </DetailSection>
      <DetailSection title="Santé">
        <Field label="Groupe sanguin" value={u.groupeSanguin} />
        <Field label="Poids (kg)" value={u.poids} />
        <Field label="Hauteur (cm)" value={u.hauteur} />
        <Field label="Pointure chaussure" value={u.pointureChaussure} />
        <Field label="Taille vêtements" value={u.tailleVetements} />
        <Field label="Tatouage" value={u.tatouage} />
        <Field label="Maladies chroniques" value={u.maladiesChroniques} />
        <Field label="Allergies" value={u.allergies} />
        <Field label="Opérations" value={u.operations} />
      </DetailSection>
      <DetailSection title="Emploi">
        <Field label="Date d'embauche" value={u.dateEmbauche} />
        <Field label="Expérience (années)" value={u.experienceAnnees} />
        <Field label="Salaire de départ" value={u.salaireDepart} />
        <Field label="Jours de congé autorisés" value={u.joursCongeAutorises} />
        <Field label="GSM société (MSD)" value={u.gsmSocieteMSD} />
      </DetailSection>
      <div className="rounded-lg border border-navy/10 bg-navy/[0.02] p-3">
        <p className="text-xs font-bold text-teal mb-2">Sociétés et périodes de travail</p>
        {!u.experiencesPro || u.experiencesPro.length === 0 ? (
          <p className="text-sm text-navy/40">Aucune expérience renseignée.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {u.experiencesPro.map((exp, i) => (
              <li key={i} className="text-sm text-navy">
                <span className="font-medium">{exp.societe || '—'}</span>
                {exp.periode ? <span className="text-navy/50"> · {exp.periode}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-xs text-navy/40">
        Documents justificatifs (CIN, extrait de naissance, diplôme, permis) gérés depuis le
        module de profil technicien.
      </p>
    </div>
  );
}
export default function UsersPanel() {
  const [pageData, setPageData] = useState<PagedUsers | null>(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
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
              <th className="px-4 py-3 font-semibold w-8"></th>
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Téléphone</th>
              <th className="px-4 py-3 font-semibold">Rôle</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.content.map((u) => {
              const isExpanded = expandedId === u.id;
              const isTechnicien = u.role === 'TECHNICIEN';
              return (
                <Fragment key={u.id}>
                  <tr
                    className={`border-t border-navy/5 ${isTechnicien ? 'cursor-pointer hover:bg-navy/[0.02]' : ''}`}
                    onClick={() => isTechnicien && setExpandedId(isExpanded ? null : u.id)}
                  >
                    <td className="px-4 py-3">
                      {isTechnicien && (
                        <ChevronDown
                          size={14}
                          className={`text-navy/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      )}
                    </td>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEnabled(u.id, u.enabled);
                        }}
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
                  {isTechnicien && isExpanded && (
                    <tr className="border-t border-navy/5 bg-navy/[0.015]">
                      <td colSpan={7}>
                        <TechnicienDetail u={u} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
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
