import { useEffect, useState } from 'react';
import {
  Camera, Image as ImageIcon, Loader2, Pencil, Check, X,
  User as UserIcon, Plus, Trash2,
} from 'lucide-react';
import {
  getMyUserProfile, updateMyUserProfile, uploadMyPhotoProfil, uploadMyPhotoCouverture,
} from '../services/userProfileService';
import UserPostsList from '../components/post/UserPostsList';
import type { User, ExperiencePro } from '../types/auth';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path: string | null | undefined) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
const STAGE_TYPES = ['Initiation', 'Été', 'PFE', 'Stage obligatoire'];
const STAGE_STATUTS = ['En attente', 'En cours', 'Terminé'];
const GROUPES_SANGUINS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
type FieldType = 'text' | 'date' | 'number' | 'textarea' | 'select' | 'toggle';
interface FieldDef {
  key: keyof User;
  label: string;
  type?: FieldType;
  options?: string[];
}
interface SectionDef {
  title: string;
  fields: FieldDef[];
}
const inputCls = "w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal";
const ACCOUNT_SECTION: SectionDef = {
  title: 'Informations de compte',
  fields: [
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'phone', label: 'Téléphone' },
  ],
};
const TECHNICIEN_SECTIONS: SectionDef[] = [
  { title: 'Identité', fields: [
    { key: 'dateNaissance', label: 'Date de naissance', type: 'date' },
    { key: 'cin', label: 'CIN' },
    { key: 'nomParent', label: 'Nom parent' },
    { key: 'adresse', label: 'Adresse', type: 'textarea' },
  ]},
  { title: 'Contacts', fields: [
    { key: 'gsmParent', label: 'GSM (parent)' },
    { key: 'gsmBinome', label: 'GSM (binôme)' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'instagram', label: 'Instagram' },
  ]},
  { title: 'Formation', fields: [
    { key: 'diplome', label: 'Diplôme' },
    { key: 'specialite', label: 'Spécialité' },
    { key: 'niveauScolaire', label: 'Niveau scolaire' },
    { key: 'permisConduire', label: 'Permis de conduire', type: 'toggle' },
  ]},
  { title: 'Contrat & administratif', fields: [
    { key: 'typeContrat', label: 'Type de contrat' },
    { key: 'numCnss', label: 'N° CNSS' },
    { key: 'numD17', label: 'N° D17' },
    { key: 'numeroBanque', label: 'Numéro banque / poste' },
  ]},
  { title: 'Santé', fields: [
    { key: 'groupeSanguin', label: 'Groupe sanguin', type: 'select', options: GROUPES_SANGUINS },
    { key: 'poids', label: 'Poids (kg)', type: 'number' },
    { key: 'hauteur', label: 'Hauteur (cm)', type: 'number' },
    { key: 'pointureChaussure', label: 'Pointure chaussure' },
    { key: 'tailleVetements', label: 'Taille vêtements' },
    { key: 'tatouage', label: 'Tatouage', type: 'toggle' },
    { key: 'maladiesChroniques', label: 'Maladies chroniques', type: 'textarea' },
    { key: 'allergies', label: 'Allergies', type: 'textarea' },
    { key: 'operations', label: 'Opérations', type: 'textarea' },
  ]},
  { title: 'Emploi', fields: [
    { key: 'dateEmbauche', label: "Date d'embauche", type: 'date' },
    { key: 'experienceAnnees', label: 'Expérience (années)', type: 'number' },
    { key: 'salaireDepart', label: 'Salaire de départ', type: 'number' },
    { key: 'joursCongeAutorises', label: 'Jours de congé autorisés', type: 'number' },
    { key: 'gsmSocieteMSD', label: 'GSM société (MSD)' },
  ]},
];
const ENTREPRISE_SECTIONS: SectionDef[] = [
  { title: 'Informations générales', fields: [
    { key: 'raisonSociale', label: 'Raison sociale' },
    { key: 'matriculeFiscal', label: 'Matricule fiscal' },
    { key: 'registreCommerce', label: 'Registre de commerce' },
    { key: 'secteurActivite', label: "Secteur d'activité" },
    { key: 'anneeCreation', label: 'Année de création', type: 'number' },
    { key: 'tailleEntreprise', label: "Taille de l'entreprise" },
    { key: 'descriptionEntreprise', label: 'Description', type: 'textarea' },
  ]},
  { title: 'Coordonnées', fields: [
    { key: 'entrepriseAdresse', label: 'Adresse' },
    { key: 'gouvernorat', label: 'Gouvernorat' },
    { key: 'ville', label: 'Ville' },
    { key: 'entrepriseTelephone', label: 'Téléphone entreprise' },
    { key: 'entrepriseEmail', label: 'Email entreprise' },
    { key: 'siteWeb', label: 'Site web' },
    { key: 'linkedin', label: 'LinkedIn' },
  ]},
  { title: 'Contact (responsable)', fields: [
    { key: 'nomResponsable', label: 'Nom du responsable' },
    { key: 'fonctionResponsable', label: 'Fonction' },
    { key: 'telephoneResponsable', label: 'Téléphone' },
    { key: 'emailResponsable', label: 'Email' },
  ]},
  { title: 'Informations professionnelles', fields: [
    { key: 'domainesActivite', label: "Domaines d'activité", type: 'textarea' },
    { key: 'technologiesUtilisees', label: 'Technologies utilisées', type: 'textarea' },
    { key: 'servicesProposes', label: 'Services proposés', type: 'textarea' },
    { key: 'nombreTechniciens', label: 'Nb techniciens', type: 'number' },
    { key: 'nombreStagiaires', label: 'Nb stagiaires', type: 'number' },
    { key: 'nombreEmployes', label: 'Nb employés', type: 'number' },
  ]},
];
const STAGIAIRE_SECTIONS: SectionDef[] = [
  { title: 'Informations personnelles', fields: [
    { key: 'cin', label: 'CIN' },
    { key: 'dateNaissance', label: 'Date de naissance', type: 'date' },
    { key: 'adresse', label: 'Adresse', type: 'textarea' },
  ]},
  { title: 'Informations académiques', fields: [
    { key: 'etablissement', label: 'Établissement' },
    { key: 'domaineFormation', label: 'Filière / Spécialité' },
    { key: 'niveauFormation', label: 'Niveau / Année' },
    { key: 'classeGroupe', label: 'Classe / groupe' },
    { key: 'anneeUniversitaire', label: 'Année universitaire' },
    { key: 'diplomePrepare', label: 'Diplôme préparé' },
    { key: 'competencesStagiaire', label: 'Compétences', type: 'textarea' },
  ]},
  { title: 'Informations du stage', fields: [
    { key: 'typeStage', label: 'Type de stage', type: 'select', options: STAGE_TYPES },
    { key: 'statutStage', label: 'Statut', type: 'select', options: STAGE_STATUTS },
    { key: 'dateDebutStage', label: 'Début de stage', type: 'date' },
    { key: 'dateFinStage', label: 'Fin de stage', type: 'date' },
    { key: 'dureeStage', label: 'Durée' },
    { key: 'sujetStage', label: 'Sujet du stage' },
    { key: 'encadrantEntreprise', label: 'Encadrant entreprise' },
    { key: 'encadrantAcademique', label: 'Encadrant académique' },
    { key: 'departementStage', label: 'Département' },
    { key: 'descriptionProjet', label: 'Description du projet', type: 'textarea' },
  ]},
];
function FieldEditor({ def, value, onChange }: { def: FieldDef; value: any; onChange: (v: any) => void }) {
  if (def.type === 'toggle') {
    return (
      <div className="flex gap-2">
        {(['OUI', 'NON'] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 rounded-lg border-2 py-1.5 text-sm font-semibold transition-colors ${
              value === opt ? 'border-teal bg-teal/10 text-teal' : 'border-navy/15 text-navy/50 hover:border-navy/30'
            }`}
          >
            {opt === 'OUI' ? 'Oui' : 'Non'}
          </button>
        ))}
      </div>
    );
  }
  if (def.type === 'select') {
    return (
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${inputCls} bg-white`}>
        <option value="">Sélectionner...</option>
        {def.options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (def.type === 'textarea') {
    return <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={2} className={inputCls} />;
  }
  return (
    <input
      type={def.type === 'date' ? 'date' : def.type === 'number' ? 'number' : 'text'}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}
function displayValue(def: FieldDef, value: any): string {
  if (value === null || value === undefined || value === '') return '—';
  if (def.type === 'toggle') return value === 'OUI' ? 'Oui' : 'Non';
  return String(value);
}
function EditableSection({
  section, form, onFieldChange, onSave, saving,
}: {
  section: SectionDef;
  form: Partial<User>;
  onFieldChange: (key: keyof User, value: any) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [snapshot, setSnapshot] = useState<Partial<User>>({});
  const startEdit = () => {
    setSnapshot({ ...form });
    setEditing(true);
  };
  const cancel = () => {
    section.fields.forEach((f) => onFieldChange(f.key, (snapshot as any)[f.key]));
    setEditing(false);
  };
  const save = async () => {
    await onSave();
    setEditing(false);
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-teal uppercase tracking-wide">{section.title}</h2>
        {!editing ? (
          <button onClick={startEdit} className="text-navy/40 hover:text-teal transition-colors p-1.5 rounded-full hover:bg-teal/5">
            <Pencil size={15} />
          </button>
        ) : (
          <div className="flex gap-1.5">
            <button onClick={cancel} className="text-navy/40 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50">
              <X size={15} />
            </button>
            <button onClick={save} disabled={saving} className="text-teal hover:text-teal/70 transition-colors p-1.5 rounded-full hover:bg-teal/5 disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            </button>
          </div>
        )}
      </div>
      {!editing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {section.fields.map((f) => (
            <div key={String(f.key)}>
              <p className="text-[11px] text-navy/40 font-semibold uppercase tracking-wide">{f.label}</p>
              <p className="text-sm text-navy mt-0.5 whitespace-pre-line">{displayValue(f, (form as any)[f.key])}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {section.fields.map((f) => (
            <div key={String(f.key)} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label className="block text-[11px] font-medium text-navy/60 mb-1">{f.label}</label>
              <FieldEditor def={f} value={(form as any)[f.key]} onChange={(v) => onFieldChange(f.key, v)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function ExperiencesSection({
  experiences, setExperiences, onSave, saving,
}: {
  experiences: ExperiencePro[];
  setExperiences: (e: ExperiencePro[]) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [snapshot, setSnapshot] = useState<ExperiencePro[]>([]);
  const startEdit = () => { setSnapshot(experiences); setEditing(true); };
  const cancel = () => { setExperiences(snapshot); setEditing(false); };
  const save = async () => { await onSave(); setEditing(false); };
  const add = () => setExperiences([...experiences, { societe: '', periode: '' }]);
  const remove = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));
  const update = (i: number, key: keyof ExperiencePro, value: string) =>
    setExperiences(experiences.map((e, idx) => (idx === i ? { ...e, [key]: value } : e)));
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-teal uppercase tracking-wide">Sociétés et périodes de travail</h2>
        {!editing ? (
          <button onClick={startEdit} className="text-navy/40 hover:text-teal transition-colors p-1.5 rounded-full hover:bg-teal/5">
            <Pencil size={15} />
          </button>
        ) : (
          <div className="flex gap-1.5">
            <button onClick={cancel} className="text-navy/40 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50">
              <X size={15} />
            </button>
            <button onClick={save} disabled={saving} className="text-teal hover:text-teal/70 transition-colors p-1.5 rounded-full hover:bg-teal/5 disabled:opacity-50">
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            </button>
          </div>
        )}
      </div>
      {!editing ? (
        experiences.length === 0 ? (
          <p className="text-sm text-navy/40">Aucune expérience renseignée.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {experiences.map((exp, i) => (
              <li key={i} className="text-sm text-navy">
                <span className="font-medium">{exp.societe || '—'}</span>
                {exp.periode ? <span className="text-navy/50"> · {exp.periode}</span> : null}
              </li>
            ))}
          </ul>
        )
      ) : (
        <div className="flex flex-col gap-2.5">
          {experiences.map((exp, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input value={exp.societe} onChange={(e) => update(i, 'societe', e.target.value)} placeholder="Société" className={inputCls} />
              <input value={exp.periode} onChange={(e) => update(i, 'periode', e.target.value)} placeholder="Période" className={inputCls} />
              <button type="button" onClick={() => remove(i)} className="shrink-0 mt-0.5 p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button type="button" onClick={add} className="self-start flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal/80 transition-colors">
            <Plus size={16} /> Ajouter une expérience
          </button>
        </div>
      )}
    </div>
  );
}
function BioEditor({
  bio, onChange, onSave, saving,
}: {
  bio?: string;
  onChange: (v: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [snapshot, setSnapshot] = useState('');
  const startEdit = () => { setSnapshot(bio ?? ''); setEditing(true); };
  const cancel = () => { onChange(snapshot); setEditing(false); };
  const save = async () => { await onSave(); setEditing(false); };
  if (!editing) {
    return (
      <div className="group flex items-start gap-2">
        <p className="text-sm text-navy/70 italic flex-1">
          {bio ? `"${bio}"` : 'Ajouter une bio...'}
        </p>
        <button
          onClick={startEdit}
          className="text-navy/30 hover:text-teal transition-colors p-1 rounded-full hover:bg-teal/5 opacity-0 group-hover:opacity-100 shrink-0"
        >
          <Pencil size={13} />
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={bio ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="Ex: Ingénieur en électricité | Passionné d'énergie renouvelable"
        className="w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm italic focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal resize-none"
      />
      <div className="flex gap-2 self-end">
        <button onClick={cancel} className="text-navy/40 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50">
          <X size={15} />
        </button>
        <button onClick={save} disabled={saving} className="text-teal hover:text-teal/70 transition-colors p-1.5 rounded-full hover:bg-teal/5 disabled:opacity-50">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
        </button>
      </div>
    </div>
  );
}
export default function ProfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>({});
  const [experiences, setExperiences] = useState<ExperiencePro[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  useEffect(() => {
    getMyUserProfile()
      .then((u) => {
        setUser(u);
        setForm(u);
        setExperiences(u.experiencesPro ?? []);
      })
      .catch(() => setError('Impossible de charger votre profil.'))
      .finally(() => setLoading(false));
  }, []);
  const fieldChange = (key: keyof User, value: any) => setForm((f) => ({ ...f, [key]: value }));
  async function persist() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        experiencesPro: user?.role === 'TECHNICIEN' ? experiences.filter((ex) => ex.societe || ex.periode) : undefined,
      };
      const updated = await updateMyUserProfile(payload);
      setUser(updated);
      setForm(updated);
      setExperiences(updated.experiencesPro ?? []);
    } catch {
      setError("Impossible d'enregistrer les modifications.");
      throw new Error('save-failed');
    } finally {
      setSaving(false);
    }
  }
  async function handlePhotoProfil(file: File | null) {
    if (!file) return;
    setUploadingKey('photoProfil');
    try {
      const updated = await uploadMyPhotoProfil(file);
      setUser(updated);
      setForm(updated);
    } catch {
      setError("Échec de l'upload de la photo de profil.");
    } finally {
      setUploadingKey(null);
    }
  }
  async function handlePhotoCouverture(file: File | null) {
    if (!file) return;
    setUploadingKey('photoCouverture');
    try {
      const updated = await uploadMyPhotoCouverture(file);
      setUser(updated);
      setForm(updated);
    } catch {
      setError("Échec de l'upload de la photo de couverture.");
    } finally {
      setUploadingKey(null);
    }
  }
  if (loading) {
    return <div className="min-h-[70vh] grid place-items-center"><Loader2 className="animate-spin text-navy/40" size={28} /></div>;
  }
  if (!user) {
    return <div className="min-h-[70vh] grid place-items-center"><p className="text-red-600">{error ?? 'Profil introuvable.'}</p></div>;
  }
  const ROLE_LABELS: Record<string, string> = {
    TECHNICIEN: 'Technicien', ENTREPRISE: 'Entreprise', STAGIAIRE: 'Stagiaire',
    BENEFICIEL: 'Bénéficiaire', ADMIN: 'Administrateur',
  };
  const fullName = `${form.prenom || ''} ${form.nom || ''}`.trim() || 'Mon profil';
  const roleSections =
    user.role === 'TECHNICIEN' ? TECHNICIEN_SECTIONS :
    user.role === 'ENTREPRISE' ? ENTREPRISE_SECTIONS :
    user.role === 'STAGIAIRE' ? STAGIAIRE_SECTIONS : [];
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pb-16">
      {/* Bannière */}
      <div className="relative h-48 md:h-60 w-full bg-gradient-to-br from-navy via-navy-dark to-teal overflow-hidden">
        {user.photoCouverturePath && (
          <img src={imageUrl(user.photoCouverturePath)} alt="Couverture" className="w-full h-full object-cover" />
        )}
        <label className="absolute bottom-4 end-4 grid place-items-center h-9 w-9 rounded-full bg-white/90 hover:bg-white cursor-pointer shadow transition-colors">
          {uploadingKey === 'photoCouverture' ? (
            <Loader2 size={15} className="animate-spin text-navy" />
          ) : (
            <ImageIcon size={15} className="text-navy" />
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => handlePhotoCouverture(e.target.files?.[0] ?? null)} />
        </label>
      </div>
      <div className="mx-auto max-w-4xl px-4">
        {/* Header profil */}
        <div className="relative -mt-16 mb-6 bg-white rounded-xl shadow-sm px-6 pt-4 pb-5">
          <div className="relative h-28 w-28 rounded-full border-4 border-white bg-navy/10 overflow-hidden shrink-0 -mt-16 mb-3">
            {user.photoProfilPath ? (
              <img src={imageUrl(user.photoProfilPath)} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={36} /></div>
            )}
            <label className="absolute inset-0 grid place-items-center bg-black/0 hover:bg-black/30 transition-colors cursor-pointer group">
              {uploadingKey === 'photoProfil' ? (
                <Loader2 size={16} className="animate-spin text-white" />
              ) : (
                <Camera size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => handlePhotoProfil(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <h1 className="text-xl font-black text-navy">{fullName}</h1>
          <p className="text-sm text-navy/50 mt-0.5 mb-3">{ROLE_LABELS[user.role] ?? user.role} — CTTEERA</p>
          <BioEditor bio={form.bio} onChange={(v) => fieldChange('bio', v)} onSave={persist} saving={saving} />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
        <div className="flex flex-col gap-5">
          <EditableSection section={ACCOUNT_SECTION} form={form} onFieldChange={fieldChange} onSave={persist} saving={saving} />
          {roleSections.map((section) => (
            <EditableSection key={section.title} section={section} form={form} onFieldChange={fieldChange} onSave={persist} saving={saving} />
          ))}
          {user.role === 'TECHNICIEN' && (
            <ExperiencesSection experiences={experiences} setExperiences={setExperiences} onSave={persist} saving={saving} />
          )}
        </div>
        <div className="mt-6">
          <h2 className="text-sm font-bold text-teal uppercase tracking-wide mb-3">Publications</h2>
          <UserPostsList authorId={user.id} />
        </div>
      </div>
    </div>
  );
}