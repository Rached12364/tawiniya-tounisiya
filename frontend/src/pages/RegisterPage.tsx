import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User,
  Mail,
  Phone,
  Lock,
  UserPlus,
  Loader2,
  Wrench,
  Building2,
  GraduationCap,
  Check,
  ChevronDown,
  Plus,
  Trash2,
} from 'lucide-react';
import { register } from '../services/authService';
import { useAuthStore, redirectPathForRole } from '../store/authStore';
import type { ApiError, Role } from '../types/auth';
// L'ADMIN n'est jamais proposé dans un formulaire public — voir note en fin de fichier.
const ROLE_OPTIONS: { value: Role; label: string; icon: typeof Wrench; description: string }[] = [
  { value: 'TECHNICIEN', label: 'Technicien', icon: Wrench, description: 'Électricité, énergie renouvelable' },
  { value: 'ENTREPRISE', label: 'Entreprise', icon: Building2, description: 'Structure ou société' },
  { value: 'STAGIAIRE', label: 'Stagiaire', icon: GraduationCap, description: 'En formation ou apprentissage' },
];
const SPECIALITES = ['Électricité', 'Énergie renouvelable', 'Froid & Climatisation', 'Autre'];
const NIVEAUX_FORMATION = ['BTP', 'BTS', 'Licence', 'Ingénierie', 'Autre'];
const GROUPES_SANGUINS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
type ExperiencePro = { id: string; societe: string; periode: string };
type TechnicienSectionKey = 'identite' | 'contacts' | 'formation' | 'contrat' | 'sante' | 'emploi';
function SectionAccordion({
  title,
  sectionKey,
  openSection,
  setOpenSection,
  children,
}: {
  title: string;
  sectionKey: TechnicienSectionKey;
  openSection: TechnicienSectionKey | null;
  setOpenSection: (key: TechnicienSectionKey | null) => void;
  children: React.ReactNode;
}) {
  const isOpen = openSection === sectionKey;
  return (
    <div className="rounded-xl border border-navy/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpenSection(isOpen ? null : sectionKey)}
        className="w-full flex items-center justify-between px-4 py-3 bg-navy/[0.03] text-sm font-semibold text-navy"
      >
        {title}
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-4 grid sm:grid-cols-2 gap-4">{children}</div>}
    </div>
  );
}
function TextField({
  label,
  value,
  onChange,
  full,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  full?: boolean;
  type?: string;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
      />
    </div>
  );
}
function SelectField({
  label,
  value,
  onChange,
  options,
  full,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  full?: boolean;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal bg-white"
      >
        <option value="">Choisir...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
function OuiNonField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: 'OUI' | 'NON' | '';
  onChange: (v: 'OUI' | 'NON') => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      <div className="flex gap-2">
        {(['OUI', 'NON'] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              value === opt
                ? 'border-teal bg-teal/10 text-teal'
                : 'border-navy/15 text-navy/60 hover:border-navy/30'
            }`}
          >
            {opt === 'OUI' ? 'Oui' : 'Non'}
          </button>
        ))}
      </div>
    </div>
  );
}
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
    // Entreprise
    raisonSociale: '',
    matriculeFiscal: '',
    secteurActivite: '',
    // Stagiaire
    etablissement: '',
    niveauFormation: '',
    domaineFormation: '',
    // Technicien — Identité
    dateNaissance: '',
    cin: '',
    nomParent: '',
    adresse: '',
    // Technicien — Contacts
    gsmParent: '',
    gsmBinome: '',
    facebook: '',
    tiktok: '',
    instagram: '',
    // Technicien — Formation
    diplome: '',
    specialite: '',
    niveauScolaire: '',
    permisConduire: '' as 'OUI' | 'NON' | '',
    // Technicien — Contrat & administratif
    typeContrat: '',
    numCnss: '',
    numD17: '',
    numeroBanque: '',
    // Technicien — Santé
    groupeSanguin: '',
    poids: '',
    hauteur: '',
    pointureChaussure: '',
    tailleVetements: '',
    tatouage: '' as 'OUI' | 'NON' | '',
    maladiesChroniques: '',
    allergies: '',
    operations: '',
    // Technicien — Emploi
    dateEmbauche: '',
    experienceAnnees: '',
    salaireDepart: '',
    joursCongeAutorises: '',
    gsmSocieteMSD: '',
  });
  const [experiencesPro, setExperiencesPro] = useState<ExperiencePro[]>([]);
  const [openSection, setOpenSection] = useState<TechnicienSectionKey | null>('identite');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const selectRole = (role: Role) => setForm((f) => ({ ...f, role }));
  const addExperiencePro = () =>
    setExperiencesPro((list) => [...list, { id: crypto.randomUUID(), societe: '', periode: '' }]);
  const updateExperiencePro = (id: string, key: 'societe' | 'periode', value: string) =>
    setExperiencesPro((list) => list.map((exp) => (exp.id === id ? { ...exp, [key]: value } : exp)));
  const removeExperiencePro = (id: string) =>
    setExperiencesPro((list) => list.filter((exp) => exp.id !== id));
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);
    try {
      const payload =
        form.role === 'TECHNICIEN'
          ? { ...form, experiencesPro: experiencesPro.map(({ societe, periode }) => ({ societe, periode })) }
          : form;
      const { token, user } = await register(payload);
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
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-black text-navy text-center">Créer un compte</h1>
        <p className="mt-1.5 text-sm text-navy/50 text-center">
          Rejoignez la plateforme selon votre profil.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-2">Vous êtes...</label>
            <div className="grid grid-cols-3 gap-2.5">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = form.role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectRole(opt.value)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3.5 text-center transition-colors ${
                      isSelected
                        ? 'border-teal bg-teal/5'
                        : 'border-navy/10 hover:border-navy/25 hover:bg-navy/[0.02]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 end-1.5 h-4 w-4 rounded-full bg-teal text-white grid place-items-center">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                    <Icon size={22} className={isSelected ? 'text-teal' : 'text-navy/40'} />
                    <span className={`text-[13px] font-semibold ${isSelected ? 'text-teal' : 'text-navy'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-navy/40 leading-tight">{opt.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Champs communs — base du compte */}
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
              <label className="block text-sm font-medium text-navy mb-1.5">
                {form.role === 'TECHNICIEN' ? 'GSM' : 'Téléphone'}
              </label>
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
          {form.role === 'ENTREPRISE' && (
            <div className="grid sm:grid-cols-2 gap-4 rounded-xl bg-teal/5 border border-teal/15 p-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-navy mb-1.5">Raison sociale</label>
                <input
                  required
                  value={form.raisonSociale}
                  onChange={update('raisonSociale')}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Matricule fiscal</label>
                <input
                  value={form.matriculeFiscal}
                  onChange={update('matriculeFiscal')}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Secteur d'activité</label>
                <input
                  value={form.secteurActivite}
                  onChange={update('secteurActivite')}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                />
              </div>
            </div>
          )}
          {form.role === 'STAGIAIRE' && (
            <div className="grid sm:grid-cols-2 gap-4 rounded-xl bg-teal/5 border border-teal/15 p-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-navy mb-1.5">Établissement</label>
                <input
                  required
                  value={form.etablissement}
                  onChange={update('etablissement')}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Niveau de formation</label>
                <select
                  value={form.niveauFormation}
                  onChange={update('niveauFormation')}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal bg-white"
                >
                  <option value="">Choisir...</option>
                  {NIVEAUX_FORMATION.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Domaine de formation</label>
                <input
                  value={form.domaineFormation}
                  onChange={update('domaineFormation')}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                />
              </div>
            </div>
          )}
          {form.role === 'TECHNICIEN' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-navy/40">
                Les documents justificatifs (CIN, extrait de naissance, diplôme, permis) se déposent
                après la création du compte, depuis votre profil.
              </p>
              <SectionAccordion title="Identité" sectionKey="identite" openSection={openSection} setOpenSection={setOpenSection}>
                <TextField label="Date de naissance" type="date" value={form.dateNaissance} onChange={update('dateNaissance')} />
                <TextField label="CIN" value={form.cin} onChange={update('cin')} />
                <TextField label="Nom parent" value={form.nomParent} onChange={update('nomParent')} />
                <TextField label="Adresse" value={form.adresse} onChange={update('adresse')} full />
              </SectionAccordion>
              <SectionAccordion title="Contacts" sectionKey="contacts" openSection={openSection} setOpenSection={setOpenSection}>
                <TextField label="GSM (parent)" value={form.gsmParent} onChange={update('gsmParent')} />
                <TextField label="GSM (binôme)" value={form.gsmBinome} onChange={update('gsmBinome')} />
                <TextField label="Facebook" value={form.facebook} onChange={update('facebook')} />
                <TextField label="TikTok" value={form.tiktok} onChange={update('tiktok')} />
                <TextField label="Instagram" value={form.instagram} onChange={update('instagram')} full />
              </SectionAccordion>
              <SectionAccordion title="Formation" sectionKey="formation" openSection={openSection} setOpenSection={setOpenSection}>
                <TextField label="Diplôme" value={form.diplome} onChange={update('diplome')} />
                <SelectField label="Spécialité" value={form.specialite} onChange={update('specialite')} options={SPECIALITES} />
                <TextField label="Niveau scolaire" value={form.niveauScolaire} onChange={update('niveauScolaire')} />
                <OuiNonField
                  label="Permis de conduire"
                  value={form.permisConduire}
                  onChange={(v) => setForm((f) => ({ ...f, permisConduire: v }))}
                />
              </SectionAccordion>
              <SectionAccordion title="Contrat & administratif" sectionKey="contrat" openSection={openSection} setOpenSection={setOpenSection}>
                <TextField label="Type de contrat" value={form.typeContrat} onChange={update('typeContrat')} />
                <TextField label="N° CNSS" value={form.numCnss} onChange={update('numCnss')} />
                <TextField label="N° D17" value={form.numD17} onChange={update('numD17')} />
                <TextField label="Numéro banque / poste" value={form.numeroBanque} onChange={update('numeroBanque')} />
              </SectionAccordion>
              <SectionAccordion title="Santé" sectionKey="sante" openSection={openSection} setOpenSection={setOpenSection}>
                <SelectField label="Groupe sanguin" value={form.groupeSanguin} onChange={update('groupeSanguin')} options={GROUPES_SANGUINS} />
                <TextField label="Poids (kg)" type="number" value={form.poids} onChange={update('poids')} />
                <TextField label="Hauteur (cm)" type="number" value={form.hauteur} onChange={update('hauteur')} />
                <TextField label="Pointure chaussure" value={form.pointureChaussure} onChange={update('pointureChaussure')} />
                <TextField label="Taille vêtements" value={form.tailleVetements} onChange={update('tailleVetements')} />
                <OuiNonField label="Tatouage" value={form.tatouage} onChange={(v) => setForm((f) => ({ ...f, tatouage: v }))} />
                <TextField label="Maladies chroniques" value={form.maladiesChroniques} onChange={update('maladiesChroniques')} full />
                <TextField label="Allergies" value={form.allergies} onChange={update('allergies')} full />
                <TextField label="Opérations" value={form.operations} onChange={update('operations')} full />
              </SectionAccordion>
              <SectionAccordion title="Emploi" sectionKey="emploi" openSection={openSection} setOpenSection={setOpenSection}>
                <TextField label="Date d'embauche" type="date" value={form.dateEmbauche} onChange={update('dateEmbauche')} />
                <TextField label="Expérience (années)" type="number" value={form.experienceAnnees} onChange={update('experienceAnnees')} />
                <TextField label="Salaire de départ" type="number" value={form.salaireDepart} onChange={update('salaireDepart')} />
                <TextField label="Jours de congé autorisés" type="number" value={form.joursCongeAutorises} onChange={update('joursCongeAutorises')} />
                <TextField label="GSM société (MSD)" value={form.gsmSocieteMSD} onChange={update('gsmSocieteMSD')} full />
                <div className="sm:col-span-2 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-navy">
                      Sociétés et périodes de travail (expérience)
                    </label>
                    <button
                      type="button"
                      onClick={addExperiencePro}
                      className="flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
                    >
                      <Plus size={14} /> Ajouter
                    </button>
                  </div>
                  {experiencesPro.length === 0 && (
                    <p className="text-xs text-navy/40">Aucune expérience ajoutée.</p>
                  )}
                  {experiencesPro.map((exp) => (
                    <div key={exp.id} className="flex gap-2 items-center">
                      <input
                        placeholder="Société"
                        value={exp.societe}
                        onChange={(e) => updateExperiencePro(exp.id, 'societe', e.target.value)}
                        className="flex-1 rounded-lg border border-navy/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                      />
                      <input
                        placeholder="Période (ex: 2021-2023)"
                        value={exp.periode}
                        onChange={(e) => updateExperiencePro(exp.id, 'periode', e.target.value)}
                        className="flex-1 rounded-lg border border-navy/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                      />
                      <button
                        type="button"
                        onClick={() => removeExperiencePro(exp.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </SectionAccordion>
            </div>
          )}
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
// Le rôle BENEFICIEL n'est plus proposé dans ce formulaire (retiré à la demande) mais
// reste supporté côté backend/base de données pour les comptes existants.
// Les champs détaillés du profil Technicien (identité, contacts, formation, contrat,
// santé, emploi) sont tous collectés ici à l'inscription. Les documents justificatifs
// (CIN, extrait de naissance, diplôme, permis) sont déposés séparément après inscription
// via le module de profil technicien déjà existant.
