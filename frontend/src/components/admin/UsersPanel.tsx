import { Fragment, useEffect, useState, useCallback, useMemo } from 'react';
import { Ban, CheckCircle2, ChevronDown, Trash2, Search } from 'lucide-react';
import { getUsers, enableUser, disableUser, deleteUser } from '../../services/adminService';
import type { PagedUsers } from '../../types/admin';
import type { User } from '../../types/auth';
const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  TECHNICIEN: 'Technicien',
  ENTREPRISE: 'Entreprise',
  CENTRE_FORMATION: 'Centre de formation',
  BENEFICIEL: 'Bénéficiaire',
  EXPERT_JURIDIQUE: 'Expert Juridique',
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
function EntrepriseDetail({ u }: { u: User }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <DetailSection title="Informations générales">
        <Field label="Raison sociale" value={u.raisonSociale} />
        <Field label="Matricule fiscal" value={u.matriculeFiscal} />
        <Field label="Registre de commerce" value={u.registreCommerce} />
        <Field label="Secteur d'activité" value={u.secteurActivite} />
        <Field label="Année de création" value={u.anneeCreation} />
        <Field label="Taille de l'entreprise" value={u.tailleEntreprise} />
      </DetailSection>
      {u.descriptionEntreprise && (
        <div className="rounded-lg border border-navy/10 bg-navy/[0.02] p-3">
          <p className="text-xs font-bold text-teal mb-2">Description</p>
          <p className="text-sm text-navy whitespace-pre-line">{u.descriptionEntreprise}</p>
        </div>
      )}
      <DetailSection title="Coordonnées">
        <Field label="Adresse" value={u.entrepriseAdresse} />
        <Field label="Gouvernorat" value={u.gouvernorat} />
        <Field label="Ville" value={u.ville} />
        <Field label="Téléphone entreprise" value={u.entrepriseTelephone} />
        <Field label="Email entreprise" value={u.entrepriseEmail} />
        <Field label="Site web" value={u.siteWeb} />
        <Field label="LinkedIn" value={u.linkedin} />
      </DetailSection>
      <DetailSection title="Contact (responsable)">
        <Field label="Nom du responsable" value={u.nomResponsable} />
        <Field label="Fonction" value={u.fonctionResponsable} />
        <Field label="Téléphone" value={u.telephoneResponsable} />
        <Field label="Email" value={u.emailResponsable} />
      </DetailSection>
      <DetailSection title="Informations professionnelles">
        <Field label="Domaines d'activité" value={u.domainesActivite} />
        <Field label="Technologies utilisées" value={u.technologiesUtilisees} />
        <Field label="Services proposés" value={u.servicesProposes} />
        <Field label="Nb techniciens" value={u.nombreTechniciens} />
        <Field label="Nb stagiaires" value={u.nombreStagiaires} />
        <Field label="Nb employés" value={u.nombreEmployes} />
      </DetailSection>
    </div>
  );
}
function CentreFormationDetail({ u }: { u: User }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <DetailSection title="Informations du centre">
        <Field label="Adresse" value={u.adresse} />
        <Field label="Site web" value={u.siteWeb} />
        <Field label="Horaires" value={u.horaires} />
      </DetailSection>
      {u.formationsProposees && (
        <div className="rounded-lg border border-navy/10 bg-navy/[0.02] p-3">
          <p className="text-xs font-bold text-teal mb-2">Formations proposées</p>
          <p className="text-sm text-navy whitespace-pre-line">{u.formationsProposees}</p>
        </div>
      )}
    </div>
  );
}
function ExpertJuridiqueDetail({ u }: { u: User }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <DetailSection title="Informations">
        <Field label="Adresse (cabinet)" value={u.adresse} />
        <Field label="Gouvernorat" value={u.gouvernorat} />
        <Field label="Bio" value={u.bio} />
      </DetailSection>
    </div>
  );
}
const ROLE_FILTER_OPTIONS = ['TOUS', 'ADMIN', 'TECHNICIEN', 'ENTREPRISE', 'CENTRE_FORMATION', 'BENEFICIEL', 'EXPERT_JURIDIQUE'];
export default function UsersPanel() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('TOUS');
  const [statusFilter, setStatusFilter] = useState('TOUS');
  const load = useCallback(() => {
    setLoading(true);
    getUsers(0, 1000)
      .then((data: PagedUsers) => setAllUsers(data.content))
      .catch(() => setError('Impossible de charger les utilisateurs.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allUsers.filter((u) => {
      if (roleFilter !== 'TOUS' && u.role !== roleFilter) return false;
      if (statusFilter === 'ACTIF' && !u.enabled) return false;
      if (statusFilter === 'DESACTIVE' && u.enabled) return false;
      if (q) {
        const haystack = `${u.prenom} ${u.nom} ${u.email}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [allUsers, search, roleFilter, statusFilter]);
  async function toggleEnabled(id: number, enabled: boolean) {
    setBusyId(id);
    try {
      if (enabled) {
        await disableUser(id);
      } else {
        await enableUser(id);
      }
      load();
    } catch {
      setError("Impossible de modifier le statut de l'utilisateur.");
    } finally {
      setBusyId(null);
    }
  }
  async function handleDelete(id: number, fullName: string) {
    if (!window.confirm(`Supprimer definitivement le compte de ${fullName} ? Cette action est irreversible et supprimera aussi ses publications, commentaires et connexions.`)) return;
    setBusyId(id);
    try {
      await deleteUser(id);
      load();
    } catch {
      setError("Impossible de supprimer cet utilisateur.");
    } finally {
      setBusyId(null);
    }
  }
  if (loading && allUsers.length === 0) {
    return <p className="text-navy/60">Chargement des utilisateurs…</p>;
  }
  if (error) {
    return <p className="text-red-600">{error}</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full rounded-full border border-navy/15 bg-white ps-9 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-full border border-navy/15 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
        >
          {ROLE_FILTER_OPTIONS.map((r) => (
            <option key={r} value={r}>{r === 'TOUS' ? 'Tous les rôles' : (ROLE_LABELS[r] ?? r)}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-full border border-navy/15 bg-white px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
        >
          <option value="TOUS">Tous les statuts</option>
          <option value="ACTIF">Actif</option>
          <option value="DESACTIVE">Désactivé</option>
        </select>
      </div>
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-navy/40">
                    Aucun utilisateur ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isExpanded = expandedId === u.id;
                  const hasDetail = u.role === 'TECHNICIEN' || u.role === 'ENTREPRISE' || u.role === 'CENTRE_FORMATION' || u.role === 'EXPERT_JURIDIQUE';
                  return (
                    <Fragment key={u.id}>
                      <tr
                        className={`border-t border-navy/5 ${hasDetail ? 'cursor-pointer hover:bg-navy/[0.02]' : ''}`}
                        onClick={() => hasDetail && setExpandedId(isExpanded ? null : u.id)}
                      >
                        <td className="px-4 py-3">
                          {hasDetail && (
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
                          <div className="flex items-center justify-end gap-2">
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(u.id, `${u.prenom} ${u.nom}`.trim());
                              }}
                              disabled={busyId === u.id}
                              title="Supprimer definitivement"
                              className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1.5 text-xs font-semibold text-navy/50 hover:bg-red-100 hover:text-red-700 transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {hasDetail && isExpanded && (
                        <tr className="border-t border-navy/5 bg-navy/[0.015]">
                          <td colSpan={7}>
                            {u.role === 'TECHNICIEN' && <TechnicienDetail u={u} />}
                            {u.role === 'ENTREPRISE' && <EntrepriseDetail u={u} />}
                            {u.role === 'CENTRE_FORMATION' && <CentreFormationDetail u={u} />}
                            {u.role === 'EXPERT_JURIDIQUE' && <ExpertJuridiqueDetail u={u} />}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-navy/10 text-sm text-navy/60">
          <span>{filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} affiché{filteredUsers.length > 1 ? 's' : ''} sur {allUsers.length}</span>
        </div>
      </div>
    </div>
  );
}