import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, Lock, UserPlus, Loader2, Wrench, Building2, GraduationCap, HeartHandshake, Check, Plus, Trash2 } from 'lucide-react';
import { register } from '../services/authService';
import { useAuthStore, redirectPathForRole } from '../store/authStore';
import type { ApiError, Role, RegisterPayload, ExperiencePro } from '../types/auth';
const ROLE_OPTIONS: { value: Role; label: string; icon: typeof Wrench; description: string }[] = [
  { value: 'TECHNICIEN', label: 'Technicien', icon: Wrench, description: 'Électricité, énergie renouvelable' },
  { value: 'ENTREPRISE', label: 'Entreprise', icon: Building2, description: 'Structure ou société' },
  { value: 'CENTRE_FORMATION', label: 'Centre de formation', icon: GraduationCap, description: 'Formations et apprentissage' },
  { value: 'BENEFICIEL', label: 'Bénéficiaire', icon: HeartHandshake, description: 'Beneficiaire des services' },
];
const GROUPES_SANGUINS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GOUVERNORATS = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan',
  'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'La Manouba', 'Médenine', 'Monastir',
  'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 'Tozeur', 'Tunis', 'Zaghouan',
];
const SPECIALITES_CATEGORIES: { title: string; options: string[] }[] = [
  { title: 'Électricité', options: ['Électricité bâtiment', 'Électricité industrielle'] },
  { title: 'Sécurité & Protection', options: ['Caméras de surveillance', 'Contrôle d\u2019accès', 'Système anti-incendie', 'Système anti-intrusion'] },
  { title: 'Smart Home & Automatisation', options: ['Smart Home / Domotique', 'Automatisation'] },
  { title: 'Énergie Renouvelable', options: ['Photovoltaïque', 'Pompage solaire', 'STEG Off-grid / On-grid / Installation'] },
  { title: 'Réseaux', options: ['Réseaux informatiques', 'Fibre optique'] },
];
const initialForm: RegisterPayload = {
  nom: '', prenom: '', email: '', phone: '', password: '', role: 'TECHNICIEN',
  // Technicien
  dateNaissance: '', cin: '', nomParent: '', adresse: '',
  gsmParent: '', gsmBinome: '', facebook: '', tiktok: '', instagram: '',
  diplome: '', specialite: '', niveauScolaire: '', permisConduire: null,
  typeContrat: '', numCnss: '', numD17: '', numeroBanque: '',
  groupeSanguin: '', poids: undefined, hauteur: undefined, pointureChaussure: '', tailleVetements: '',
  tatouage: null, maladiesChroniques: '', allergies: '', operations: '',
  dateEmbauche: '', experienceAnnees: undefined, salaireDepart: undefined, joursCongeAutorises: undefined, gsmSocieteMSD: '',
  // Entreprise
  raisonSociale: '', matriculeFiscal: '', registreCommerce: '', secteurActivite: '',
  descriptionEntreprise: '', anneeCreation: '', tailleEntreprise: '',
  entrepriseAdresse: '', gouvernorat: '', ville: '', entrepriseTelephone: '',
  entrepriseEmail: '', siteWeb: '', linkedin: '',
  nomResponsable: '', fonctionResponsable: '', telephoneResponsable: '', emailResponsable: '',
  domainesActivite: '', technologiesUtilisees: '', servicesProposes: '',
  nombreTechniciens: '', nombreStagiaires: '', nombreEmployes: '',
  // Centre de formation
  horaires: '', formationsProposees: '',
};
const inputCls = "w-full rounded-lg border border-navy/15 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal";
const labelCls = "block text-sm font-medium text-navy mb-1.5";
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className={labelCls}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-wide text-teal/70 -mb-1">{children}</p>;
}
function OuiNonToggle({ value, onChange }: { value: 'OUI' | 'NON' | null | undefined; onChange: (v: 'OUI' | 'NON') => void }) {
  return (
    <div className="flex gap-2">
      {(['OUI', 'NON'] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 rounded-lg border-2 py-2 text-sm font-semibold transition-colors ${
            value === opt ? 'border-teal bg-teal/10 text-teal' : 'border-navy/15 text-navy/50 hover:border-navy/30'
          }`}
        >
          {opt === 'OUI' ? 'Oui' : 'Non'}
        </button>
      ))}
    </div>
  );
}
function SpecialiteMultiSelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const selected = (value ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  function toggle(opt: string) {
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt];
    onChange(next.join(', '));
  }
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-navy/15 bg-white p-3 max-h-64 overflow-y-auto">
      {SPECIALITES_CATEGORIES.map((cat) => (
        <div key={cat.title}>
          <p className="text-[11px] font-bold uppercase tracking-wide text-teal/70 mb-1.5">{cat.title}</p>
          <div className="flex flex-col gap-1">
            {cat.options.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                  className="rounded border-navy/30 text-teal focus:ring-teal/40"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [experiences, setExperiences] = useState<ExperiencePro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmPassword, setConfirmPassword] = useState('');
  const update = (key: keyof RegisterPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const selectRole = (role: Role) => setForm((f) => ({ ...f, role }));
  const addExperience = () => setExperiences((exp) => [...exp, { societe: '', periode: '' }]);
  const removeExperience = (idx: number) => setExperiences((exp) => exp.filter((_, i) => i !== idx));
  const updateExperience = (idx: number, key: keyof ExperiencePro, value: string) =>
    setExperiences((exp) => exp.map((e, i) => (i === idx ? { ...e, [key]: value } : e)));
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    if (form.password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.role === 'TECHNICIEN' && !form.specialite?.trim()) {
      setError('Veuillez sélectionner au moins une spécialité.');
      return;
    }
    setIsLoading(true);
    try {
      const payload: RegisterPayload = {
        ...form,
        anneeCreation: form.anneeCreation ? Number(form.anneeCreation) : undefined,
        nombreTechniciens: form.nombreTechniciens ? Number(form.nombreTechniciens) : undefined,
        nombreStagiaires: form.nombreStagiaires ? Number(form.nombreStagiaires) : undefined,
        nombreEmployes: form.nombreEmployes ? Number(form.nombreEmployes) : undefined,
        poids: form.poids ? Number(form.poids) : undefined,
        hauteur: form.hauteur ? Number(form.hauteur) : undefined,
        experienceAnnees: form.experienceAnnees ? Number(form.experienceAnnees) : undefined,
        salaireDepart: form.salaireDepart ? Number(form.salaireDepart) : undefined,
        joursCongeAutorises: form.joursCongeAutorises ? Number(form.joursCongeAutorises) : undefined,
        experiencesPro: form.role === 'TECHNICIEN' ? experiences.filter((ex) => ex.societe || ex.periode) : undefined,
      };
      const { token, user } = await register(payload);
      setAuth(token, user);
      navigate(redirectPathForRole(user.role));
    } catch (err) {
      if (axios.isAxiosError<ApiError>(err) && err.response) {
        setError(err.response.data.message || "Impossible de créer le compte.");
        if (err.response.data.fieldErrors) setFieldErrors(err.response.data.fieldErrors);
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
        <p className="mt-1.5 text-sm text-navy/50 text-center">Rejoignez la plateforme selon votre profil.</p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className={labelCls}>Vous êtes...</label>
            <div className="grid grid-cols-2 gap-2.5">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = form.role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectRole(opt.value)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3.5 text-center transition-colors ${
                      isSelected ? 'border-teal bg-teal/5' : 'border-navy/10 hover:border-navy/25 hover:bg-navy/[0.02]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 end-1.5 h-4 w-4 rounded-full bg-teal text-white grid place-items-center">
                        <Check size={11} strokeWidth={3} />
                      </span>
                    )}
                    <Icon size={22} className={isSelected ? 'text-teal' : 'text-navy/40'} />
                    <span className={`text-[13px] font-semibold ${isSelected ? 'text-teal' : 'text-navy'}`}>{opt.label}</span>
                    <span className="text-[10px] text-navy/40 leading-tight">{opt.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nom" required>
              <div className="relative">
                <User size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
                <input required value={form.nom} onChange={update('nom')} className={`${inputCls} ps-10`} />
              </div>
              {fieldErrors.nom && <p className="mt-1 text-xs text-red-600">{fieldErrors.nom}</p>}
            </Field>
            <Field label="Prénom" required>
              <input required value={form.prenom} onChange={update('prenom')} className={inputCls} />
              {fieldErrors.prenom && <p className="mt-1 text-xs text-red-600">{fieldErrors.prenom}</p>}
            </Field>
          </div>
          <Field label="Email" required>
            <div className="relative">
              <Mail size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
              <input type="email" required value={form.email} onChange={update('email')} className={`${inputCls} ps-10`} />
            </div>
            {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Téléphone" required>
              <div className="relative">
                <Phone size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
                <input required value={form.phone} onChange={update('phone')} placeholder="+216 ..." className={`${inputCls} ps-10`} />
              </div>
            </Field>
            <Field label="Mot de passe" required>
              <div className="relative">
                <Lock size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
                <input type="password" required minLength={6} value={form.password} onChange={update('password')} placeholder="6 caractères min." className={`${inputCls} ps-10`} />
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </Field>
            <Field label="Confirmer le mot de passe" required>
              <div className="relative">
                <Lock size={17} className="absolute start-3 top-1/2 -translate-y-1/2 text-navy/30" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retapez le mot de passe"
                  className={`${inputCls} ps-10`}
                />
              </div>
              {confirmPassword && form.password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Les mots de passe ne correspondent pas.</p>
              )}
            </Field>
          </div>
          {form.role === 'TECHNICIEN' && (
            <div className="rounded-xl bg-teal/[0.04] border border-teal/15 p-4 flex flex-col gap-4">
              <SectionTitle>Identité</SectionTitle>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Date de naissance"><input type="date" value={form.dateNaissance} onChange={update('dateNaissance')} className={inputCls} /></Field>
                <Field label="CIN"><input value={form.cin} onChange={update('cin')} className={inputCls} /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nom parent"><input value={form.nomParent} onChange={update('nomParent')} className={inputCls} /></Field>
                <Field label="Adresse" required>
                  <select required value={form.adresse} onChange={update('adresse')} className={`${inputCls} bg-white`}>
                    <option value="">Sélectionner...</option>
                    {GOUVERNORATS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
              </div>
              <SectionTitle>Contacts</SectionTitle>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="GSM (parent)"><input value={form.gsmParent} onChange={update('gsmParent')} className={inputCls} /></Field>
                <Field label="GSM (binôme)"><input value={form.gsmBinome} onChange={update('gsmBinome')} className={inputCls} /></Field>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Facebook"><input value={form.facebook} onChange={update('facebook')} className={inputCls} /></Field>
                <Field label="TikTok"><input value={form.tiktok} onChange={update('tiktok')} className={inputCls} /></Field>
                <Field label="Instagram"><input value={form.instagram} onChange={update('instagram')} className={inputCls} /></Field>
              </div>
              <SectionTitle>Formation</SectionTitle>
              <Field label="Diplôme"><input value={form.diplome} onChange={update('diplome')} className={inputCls} /></Field>
              <Field label="Spécialité(s)" required>
                <SpecialiteMultiSelect
                  value={form.specialite}
                  onChange={(v) => setForm((f) => ({ ...f, specialite: v }))}
                />
              </Field>
              <Field label="Niveau scolaire"><input value={form.niveauScolaire} onChange={update('niveauScolaire')} className={inputCls} /></Field>
              <Field label="Permis de conduire">
                <OuiNonToggle value={form.permisConduire} onChange={(v) => setForm((f) => ({ ...f, permisConduire: v }))} />
              </Field>
              <SectionTitle>Contrat & administratif</SectionTitle>
              <Field label="Type de contrat"><input value={form.typeContrat} onChange={update('typeContrat')} className={inputCls} /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="N° CNSS"><input value={form.numCnss} onChange={update('numCnss')} className={inputCls} /></Field>
                <Field label="N° D17"><input value={form.numD17} onChange={update('numD17')} className={inputCls} /></Field>
              </div>
              <Field label="Numéro banque / poste"><input value={form.numeroBanque} onChange={update('numeroBanque')} className={inputCls} /></Field>
              <SectionTitle>Santé</SectionTitle>
              <Field label="Groupe sanguin">
                <select value={form.groupeSanguin} onChange={update('groupeSanguin')} className={`${inputCls} bg-white`}>
                  <option value="">Sélectionner...</option>
                  {GROUPES_SANGUINS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Poids (kg)"><input type="number" value={form.poids ?? ''} onChange={update('poids')} className={inputCls} /></Field>
                <Field label="Hauteur (cm)"><input type="number" value={form.hauteur ?? ''} onChange={update('hauteur')} className={inputCls} /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Pointure chaussure"><input value={form.pointureChaussure} onChange={update('pointureChaussure')} className={inputCls} /></Field>
                <Field label="Taille vêtements"><input value={form.tailleVetements} onChange={update('tailleVetements')} className={inputCls} /></Field>
              </div>
              <Field label="Tatouage">
                <OuiNonToggle value={form.tatouage} onChange={(v) => setForm((f) => ({ ...f, tatouage: v }))} />
              </Field>
              <Field label="Maladies chroniques"><textarea value={form.maladiesChroniques} onChange={update('maladiesChroniques')} rows={2} className={inputCls} /></Field>
              <Field label="Allergies"><textarea value={form.allergies} onChange={update('allergies')} rows={2} className={inputCls} /></Field>
              <Field label="Opérations"><textarea value={form.operations} onChange={update('operations')} rows={2} className={inputCls} /></Field>
              <SectionTitle>Emploi</SectionTitle>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Date d'embauche"><input type="date" value={form.dateEmbauche} onChange={update('dateEmbauche')} className={inputCls} /></Field>
                <Field label="Expérience (années)"><input type="number" value={form.experienceAnnees ?? ''} onChange={update('experienceAnnees')} className={inputCls} /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Salaire de départ"><input type="number" value={form.salaireDepart ?? ''} onChange={update('salaireDepart')} className={inputCls} /></Field>
                <Field label="Jours de congé autorisés"><input type="number" value={form.joursCongeAutorises ?? ''} onChange={update('joursCongeAutorises')} className={inputCls} /></Field>
              </div>
              <Field label="GSM société (MSD)"><input value={form.gsmSocieteMSD} onChange={update('gsmSocieteMSD')} className={inputCls} /></Field>
              <SectionTitle>Sociétés et périodes de travail (expérience)</SectionTitle>
              <div className="flex flex-col gap-2.5">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <input
                      value={exp.societe}
                      onChange={(e) => updateExperience(idx, 'societe', e.target.value)}
                      placeholder="Société"
                      className={inputCls}
                    />
                    <input
                      value={exp.periode}
                      onChange={(e) => updateExperience(idx, 'periode', e.target.value)}
                      placeholder="Période (ex: 2022-2023)"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="shrink-0 mt-0.5 p-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addExperience}
                  className="self-start flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal/80 transition-colors"
                >
                  <Plus size={16} /> Ajouter une expérience
                </button>
              </div>
            </div>
          )}
          {form.role === 'ENTREPRISE' && (
            <div className="rounded-xl bg-teal/[0.04] border border-teal/15 p-4 flex flex-col gap-4">
              <SectionTitle>Informations générales</SectionTitle>
              <Field label="Nom de l'entreprise (raison sociale)">
                <input required value={form.raisonSociale} onChange={update('raisonSociale')} className={inputCls} />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Matricule fiscal"><input value={form.matriculeFiscal} onChange={update('matriculeFiscal')} className={inputCls} /></Field>
                <Field label="Registre de commerce"><input value={form.registreCommerce} onChange={update('registreCommerce')} className={inputCls} /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Secteur d'activité"><input value={form.secteurActivite} onChange={update('secteurActivite')} className={inputCls} /></Field>
                <Field label="Taille de l'entreprise"><input value={form.tailleEntreprise} onChange={update('tailleEntreprise')} placeholder="Ex: 10-50 employés" className={inputCls} /></Field>
              </div>
              <Field label="Année de création">
                <input type="number" value={form.anneeCreation} onChange={update('anneeCreation')} className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea value={form.descriptionEntreprise} onChange={update('descriptionEntreprise')} rows={3} className={inputCls} />
              </Field>
              <SectionTitle>Coordonnées</SectionTitle>
              <Field label="Adresse"><input value={form.entrepriseAdresse} onChange={update('entrepriseAdresse')} className={inputCls} /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Gouvernorat"><input value={form.gouvernorat} onChange={update('gouvernorat')} className={inputCls} /></Field>
                <Field label="Ville"><input value={form.ville} onChange={update('ville')} className={inputCls} /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Téléphone entreprise"><input value={form.entrepriseTelephone} onChange={update('entrepriseTelephone')} className={inputCls} /></Field>
                <Field label="Email entreprise"><input type="email" value={form.entrepriseEmail} onChange={update('entrepriseEmail')} className={inputCls} /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Site web"><input value={form.siteWeb} onChange={update('siteWeb')} placeholder="https://..." className={inputCls} /></Field>
                <Field label="LinkedIn"><input value={form.linkedin} onChange={update('linkedin')} className={inputCls} /></Field>
              </div>
              <SectionTitle>Contact (responsable)</SectionTitle>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nom du responsable"><input value={form.nomResponsable} onChange={update('nomResponsable')} className={inputCls} /></Field>
                <Field label="Fonction du responsable"><input value={form.fonctionResponsable} onChange={update('fonctionResponsable')} className={inputCls} /></Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Téléphone du responsable"><input value={form.telephoneResponsable} onChange={update('telephoneResponsable')} className={inputCls} /></Field>
                <Field label="Email du responsable"><input type="email" value={form.emailResponsable} onChange={update('emailResponsable')} className={inputCls} /></Field>
              </div>
              <SectionTitle>Informations professionnelles</SectionTitle>
              <Field label="Domaines d'activité"><textarea value={form.domainesActivite} onChange={update('domainesActivite')} rows={2} className={inputCls} /></Field>
              <Field label="Technologies utilisées"><textarea value={form.technologiesUtilisees} onChange={update('technologiesUtilisees')} rows={2} className={inputCls} /></Field>
              <Field label="Services proposés"><textarea value={form.servicesProposes} onChange={update('servicesProposes')} rows={2} className={inputCls} /></Field>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="Nb techniciens"><input type="number" value={form.nombreTechniciens} onChange={update('nombreTechniciens')} className={inputCls} /></Field>
                <Field label="Nb stagiaires"><input type="number" value={form.nombreStagiaires} onChange={update('nombreStagiaires')} className={inputCls} /></Field>
                <Field label="Nb employés"><input type="number" value={form.nombreEmployes} onChange={update('nombreEmployes')} className={inputCls} /></Field>
              </div>
            </div>
          )}
          {form.role === 'CENTRE_FORMATION' && (
            <div className="rounded-xl bg-teal/[0.04] border border-teal/15 p-4 flex flex-col gap-4">
              <SectionTitle>Informations du centre</SectionTitle>
              <Field label="Adresse"><input value={form.adresse} onChange={update('adresse')} className={inputCls} /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Site web"><input value={form.siteWeb} onChange={update('siteWeb')} placeholder="https://..." className={inputCls} /></Field>
                <Field label="Horaires"><input value={form.horaires} onChange={update('horaires')} placeholder="Ex: Lun-Ven 9h-17h" className={inputCls} /></Field>
              </div>
              <Field label="Formations proposées">
                <textarea value={form.formationsProposees} onChange={update('formationsProposees')} rows={4} placeholder="Une formation par ligne" className={inputCls} />
              </Field>
            </div>
          )}
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
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
          <Link to="/login" className="text-teal font-semibold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
