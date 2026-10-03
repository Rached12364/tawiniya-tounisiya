import { useEffect, useState } from 'react';
import { Loader2, Check, EyeOff, ChevronDown } from 'lucide-react';
import { getPrivacySettings, updatePrivacySettings } from '../services/userProfileService';
import type { User } from '../types/auth';
interface FieldOption {
  key: string;
  label: string;
}
interface FieldGroup {
  title: string;
  fields: FieldOption[];
}
const COMMON_FIELDS: FieldOption[] = [
  { key: 'bio', label: 'Bio' },
  { key: 'phone', label: 'Téléphone' },
];
const FIELD_GROUPS_BY_ROLE: Record<string, FieldGroup[]> = {
  TECHNICIEN: [
    { title: 'Contact', fields: [...COMMON_FIELDS, { key: 'adresse', label: 'Adresse' }] },
    { title: 'Réseaux sociaux', fields: [
      { key: 'facebook', label: 'Facebook' },
      { key: 'tiktok', label: 'TikTok' },
      { key: 'instagram', label: 'Instagram' },
    ] },
    { title: 'Formation', fields: [
      { key: 'diplome', label: 'Diplôme' },
      { key: 'specialite', label: 'Spécialité' },
      { key: 'niveauScolaire', label: 'Niveau scolaire' },
    ] },
  ],
  ENTREPRISE: [
    { title: 'Contact', fields: [
      ...COMMON_FIELDS,
      { key: 'ville', label: 'Ville' },
      { key: 'gouvernorat', label: 'Gouvernorat' },
      { key: 'entrepriseTelephone', label: 'Téléphone entreprise' },
      { key: 'entrepriseEmail', label: 'Email entreprise' },
      { key: 'siteWeb', label: 'Site web' },
      { key: 'linkedin', label: 'LinkedIn' },
    ] },
    { title: 'Informations professionnelles', fields: [
      { key: 'secteurActivite', label: "Secteur d'activité" },
      { key: 'descriptionEntreprise', label: 'Description' },
    ] },
  ],
  CENTRE_FORMATION: [
    { title: 'Contact', fields: [...COMMON_FIELDS, { key: 'adresse', label: 'Adresse' }, { key: 'siteWeb', label: 'Site web' }] },
    { title: 'Formations', fields: [
      { key: 'horaires', label: 'Horaires' },
      { key: 'formationsProposees', label: 'Formations proposées' },
    ] },
  ],
  EXPERT_JURIDIQUE: [
    { title: 'Contact', fields: [...COMMON_FIELDS, { key: 'adresse', label: 'Adresse du cabinet' }] },
    { title: 'Formation', fields: [{ key: 'diplome', label: 'Diplôme' }] },
  ],
  MEDECIN: [
    { title: 'Contact', fields: [...COMMON_FIELDS, { key: 'adresse', label: 'Adresse du cabinet médical' }] },
  ],
};
export default function PrivacySettingsForm({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getPrivacySettings()
      .then((res) => setHidden(new Set(res.privateFields)))
      .catch(() => setError('Impossible de charger vos préférences de confidentialité.'))
      .finally(() => setLoading(false));
  }, [open]);
  function toggle(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  async function submit() {
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      await updatePrivacySettings(Array.from(hidden));
      setSuccess(true);
    } catch {
      setError("Impossible d'enregistrer vos préférences.");
    } finally {
      setSaving(false);
    }
  }
  const groups = FIELD_GROUPS_BY_ROLE[user.role] ?? [];
  if (groups.length === 0) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between"
      >
        <h2 className="flex items-center gap-2 text-sm font-bold text-teal uppercase tracking-wide">
          <EyeOff size={15} /> Confidentialité
        </h2>
        <ChevronDown size={16} className={`text-navy/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <p className="mt-3 text-xs text-navy/50">
            Cochez les informations que vous souhaitez masquer de votre profil public. Elles resteront visibles pour vous uniquement.
          </p>
          {loading ? (
            <div className="grid place-items-center py-8"><Loader2 className="animate-spin text-navy/40" size={20} /></div>
          ) : (
            <div className="mt-4 flex flex-col gap-5">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="text-[11px] font-semibold text-navy/40 uppercase tracking-wide mb-2">{group.title}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.fields.map((f) => (
                      <label key={f.key} className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hidden.has(f.key)}
                          onChange={() => toggle(f.key)}
                          className="rounded border-navy/30 text-teal focus:ring-teal/40"
                        />
                        {f.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-3">{error}</p>}
          {success && <p className="text-sm text-teal bg-teal/10 rounded-lg px-3 py-2 mt-3">Préférences enregistrées avec succès.</p>}
          <div className="flex justify-end mt-4">
            <button
              onClick={submit}
              disabled={saving || loading}
              className="flex items-center gap-1.5 rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal/90 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              Enregistrer
            </button>
          </div>
        </>
      )}
    </div>
  );
}