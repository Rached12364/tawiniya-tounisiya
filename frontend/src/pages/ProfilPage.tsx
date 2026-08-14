import { useEffect, useState, type FormEvent } from 'react';
import { Camera, Image as ImageIcon, Loader2, Save, Upload, User as UserIcon, Phone, Mail, Droplet, GraduationCap, Briefcase } from 'lucide-react';
import {
  getMyProfile,
  saveMyProfile,
  uploadPhotoProfil,
  uploadPhotoCouverture,
  uploadDocument,
  type DocumentType,
} from '../services/technicienProfileService';
import type { TechnicienProfile, TechnicienProfileFormData, GroupeSanguin } from '../types/technicienProfile';
import { GROUPE_SANGUIN_LABELS } from '../types/technicienProfile';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path: string | null) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
const EMPTY_FORM: TechnicienProfileFormData = {
  nom: '', prenom: '', dateNaissance: '', cin: '', nomParent: '', adresse: '',
  gsm: '', gsmParent: '', gsmBinome: '', email: '', facebook: '', tiktok: '', instagram: '',
  diplome: '', specialite: '', niveauScolaire: '', permisConduite: false, datePermis: '',
  typeContrat: '', numeroCnss: '', numeroD17: '', numeroBanquePoste: '',
  groupeSanguin: null, poidsKg: null, hauteurCm: null, pointureChaussure: '', tailleVetements: '',
  maladiesChroniques: '', allergies: '', operations: '', tatouage: false,
  dateEmbauche: '', experience: '', societesEtPeriodes: '', salaireDepart: null,
  nombreJoursConge: null, gsmSociete: '',
};
const GROUPES: GroupeSanguin[] = ['A_POSITIF', 'A_NEGATIF', 'B_POSITIF', 'B_NEGATIF', 'AB_POSITIF', 'AB_NEGATIF', 'O_POSITIF', 'O_NEGATIF'];
function TextField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-navy/60 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
      />
    </div>
  );
}
function NumberField({ label, value, onChange }: { label: string; value: number | null; onChange: (v: number | null) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-navy/60 mb-1">{label}</label>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
      />
    </div>
  );
}
function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="sm:col-span-2">
      <label className="block text-xs font-medium text-navy/60 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy resize-none focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
      />
    </div>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      <h2 className="text-base font-bold text-navy">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-teal shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-navy/45 leading-none mb-0.5">{label}</p>
        <p className="text-sm text-navy font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
export default function ProfilPage() {
  const [profile, setProfile] = useState<TechnicienProfile | null>(null);
  const [form, setForm] = useState<TechnicienProfileFormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  useEffect(() => {
    getMyProfile()
      .then((p) => {
        if (p) {
          setProfile(p);
          setForm({
            nom: p.nom ?? '', prenom: p.prenom ?? '', dateNaissance: p.dateNaissance ?? '',
            cin: p.cin ?? '', nomParent: p.nomParent ?? '', adresse: p.adresse ?? '',
            gsm: p.gsm ?? '', gsmParent: p.gsmParent ?? '', gsmBinome: p.gsmBinome ?? '',
            email: p.email ?? '', facebook: p.facebook ?? '', tiktok: p.tiktok ?? '', instagram: p.instagram ?? '',
            diplome: p.diplome ?? '', specialite: p.specialite ?? '', niveauScolaire: p.niveauScolaire ?? '',
            permisConduite: p.permisConduite, datePermis: p.datePermis ?? '',
            typeContrat: p.typeContrat ?? '', numeroCnss: p.numeroCnss ?? '', numeroD17: p.numeroD17 ?? '',
            numeroBanquePoste: p.numeroBanquePoste ?? '',
            groupeSanguin: p.groupeSanguin, poidsKg: p.poidsKg, hauteurCm: p.hauteurCm,
            pointureChaussure: p.pointureChaussure ?? '', tailleVetements: p.tailleVetements ?? '',
            maladiesChroniques: p.maladiesChroniques ?? '', allergies: p.allergies ?? '', operations: p.operations ?? '',
            tatouage: p.tatouage,
            dateEmbauche: p.dateEmbauche ?? '', experience: p.experience ?? '', societesEtPeriodes: p.societesEtPeriodes ?? '',
            salaireDepart: p.salaireDepart, nombreJoursConge: p.nombreJoursConge, gsmSociete: p.gsmSociete ?? '',
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  function set<K extends keyof TechnicienProfileFormData>(key: K, value: TechnicienProfileFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const payload: TechnicienProfileFormData = {
        ...form,
        dateNaissance: form.dateNaissance || null as unknown as string,
        datePermis: form.datePermis || null as unknown as string,
        dateEmbauche: form.dateEmbauche || null as unknown as string,
      };
      const updated = await saveMyProfile(payload);
      setProfile(updated);
      setSuccessMessage('Votre fiche a bien ete enregistree.');
    } catch {
      setError("Impossible d'enregistrer la fiche. Reessayez.");
    } finally {
      setSaving(false);
    }
  }
  async function handlePhotoProfil(file: File | null) {
    if (!file) return;
    setUploadingKey('photoProfil');
    try {
      const updated = await uploadPhotoProfil(file);
      setProfile(updated);
    } catch {
      setError("Echec de l'upload de la photo de profil.");
    } finally {
      setUploadingKey(null);
    }
  }
  async function handlePhotoCouverture(file: File | null) {
    if (!file) return;
    setUploadingKey('photoCouverture');
    try {
      const updated = await uploadPhotoCouverture(file);
      setProfile(updated);
    } catch {
      setError("Echec de l'upload de la photo de couverture.");
    } finally {
      setUploadingKey(null);
    }
  }
  async function handleDocument(type: DocumentType, file: File | null) {
    if (!file) return;
    setUploadingKey(type);
    try {
      const updated = await uploadDocument(type, file);
      setProfile(updated);
    } catch {
      setError("Echec de l'upload du document.");
    } finally {
      setUploadingKey(null);
    }
  }
  if (loading) {
    return <div className="min-h-[70vh] grid place-items-center"><Loader2 className="animate-spin text-navy/40" size={28} /></div>;
  }
  const fullName = `${form.prenom || ''} ${form.nom || ''}`.trim() || 'Mon profil';
  const subtitle = [form.specialite, form.diplome].filter(Boolean).join(' • ');
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-24 pb-16">
      {/* Couverture */}
      <div className="relative h-48 md:h-72 w-full bg-gradient-to-br from-navy to-teal overflow-hidden">
        {profile?.photoCouverturePath && (
          <img src={imageUrl(profile.photoCouverturePath)} alt="Couverture" className="w-full h-full object-cover" />
        )}
        <label className="absolute bottom-3 end-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy cursor-pointer hover:bg-white shadow">
          {uploadingKey === 'photoCouverture' ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
          Photo de couverture
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => handlePhotoCouverture(e.target.files?.[0] ?? null)} />
        </label>
      </div>
      <div className="mx-auto max-w-6xl px-4">
        {/* Header profil */}
        <div className="relative -mt-16 mb-6 bg-white rounded-2xl shadow-sm px-6 pt-4 pb-6 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="relative h-32 w-32 rounded-full border-4 border-white bg-navy/10 overflow-hidden shrink-0 -mt-14">
            {profile?.photoProfilPath ? (
              <img src={imageUrl(profile.photoProfilPath)} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={44} /></div>
            )}
            <label className="absolute inset-0 grid place-items-center bg-black/0 hover:bg-black/30 transition-colors cursor-pointer group">
              {uploadingKey === 'photoProfil' ? (
                <Loader2 size={18} className="animate-spin text-white" />
              ) : (
                <Camera size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => handlePhotoProfil(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-navy truncate">{fullName}</h1>
            <p className="text-sm text-navy/50">{subtitle || 'Technicien — CTTE-ERAA'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar infos rapides */}
          <aside className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-navy/70 uppercase tracking-wide">Infos rapides</h2>
              <InfoRow icon={<Phone size={16} />} label="GSM" value={form.gsm ?? ''} />
              <InfoRow icon={<Mail size={16} />} label="Email" value={form.email ?? ''} />
              <InfoRow icon={<Droplet size={16} />} label="Groupe sanguin" value={form.groupeSanguin ? GROUPE_SANGUIN_LABELS[form.groupeSanguin] : ''} />
              <InfoRow icon={<GraduationCap size={16} />} label="Diplome" value={form.diplome ?? ''} />
              <InfoRow icon={<Briefcase size={16} />} label="Type de contrat" value={form.typeContrat ?? ''} />
            </div>
            {/* Documents justificatifs */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-bold text-navy/70 uppercase tracking-wide mb-4">Documents justificatifs</h2>
              <div className="flex flex-col gap-3">
                {([
                  { key: 'cin' as DocumentType, label: "Copie carte d'identite", path: profile?.copieCinPath },
                  { key: 'extraitNaissance' as DocumentType, label: 'Extrait de naissance', path: profile?.copieExtraitNaissancePath },
                  { key: 'diplome' as DocumentType, label: 'Copie de diplome', path: profile?.copieDiplomePath },
                  { key: 'permis' as DocumentType, label: 'Copie de permis', path: profile?.copiePermisPath },
                ]).map((doc) => (
                  <div key={doc.key} className="flex items-center justify-between gap-3 rounded-xl border border-navy/10 p-3">
                    <div className="min-w-0">
                      <p className="text-sm text-navy font-medium truncate">{doc.label}</p>
                      <span className={`text-xs font-medium ${doc.path ? 'text-green-700' : 'text-navy/50'}`}>
                        {doc.path ? '✓ Depose' : 'Non depose'}
                      </span>
                    </div>
                    <label className="shrink-0 flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1.5 text-xs font-semibold text-navy cursor-pointer hover:bg-navy/10">
                      {uploadingKey === doc.key ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                      {doc.path ? 'Remplacer' : 'Deposer'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        className="hidden"
                        onChange={(e) => handleDocument(doc.key, e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>
          {/* Colonne principale : formulaire par sections */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 flex flex-col gap-6">
            <Card title="Identite">
              <TextField label="Nom" value={form.nom} onChange={(v) => set('nom', v)} />
              <TextField label="Prenom" value={form.prenom} onChange={(v) => set('prenom', v)} />
              <TextField label="Date de naissance" type="date" value={form.dateNaissance ?? ''} onChange={(v) => set('dateNaissance', v)} />
              <TextField label="CIN" value={form.cin ?? ''} onChange={(v) => set('cin', v)} />
              <TextField label="Nom parent" value={form.nomParent ?? ''} onChange={(v) => set('nomParent', v)} />
              <TextAreaField label="Adresse" value={form.adresse ?? ''} onChange={(v) => set('adresse', v)} />
            </Card>
            <Card title="Contacts">
              <TextField label="GSM" value={form.gsm ?? ''} onChange={(v) => set('gsm', v)} />
              <TextField label="GSM (parent)" value={form.gsmParent ?? ''} onChange={(v) => set('gsmParent', v)} />
              <TextField label="GSM (binome)" value={form.gsmBinome ?? ''} onChange={(v) => set('gsmBinome', v)} />
              <TextField label="Email" type="email" value={form.email ?? ''} onChange={(v) => set('email', v)} />
              <TextField label="Facebook" value={form.facebook ?? ''} onChange={(v) => set('facebook', v)} />
              <TextField label="TikTok" value={form.tiktok ?? ''} onChange={(v) => set('tiktok', v)} />
              <TextField label="Instagram" value={form.instagram ?? ''} onChange={(v) => set('instagram', v)} />
            </Card>
            <Card title="Formation">
              <TextField label="Diplome" value={form.diplome ?? ''} onChange={(v) => set('diplome', v)} />
              <TextField label="Specialite" value={form.specialite ?? ''} onChange={(v) => set('specialite', v)} />
              <TextField label="Niveau scolaire" value={form.niveauScolaire ?? ''} onChange={(v) => set('niveauScolaire', v)} />
              <div>
                <label className="block text-xs font-medium text-navy/60 mb-1">Permis de conduire</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-1.5 text-sm text-navy">
                    <input type="radio" checked={form.permisConduite} onChange={() => set('permisConduite', true)} /> Oui
                  </label>
                  <label className="flex items-center gap-1.5 text-sm text-navy">
                    <input type="radio" checked={!form.permisConduite} onChange={() => set('permisConduite', false)} /> Non
                  </label>
                </div>
              </div>
              {form.permisConduite && (
                <TextField label="Date de livraison du permis" type="date" value={form.datePermis ?? ''} onChange={(v) => set('datePermis', v)} />
              )}
            </Card>
            <Card title="Contrat & administratif">
              <TextField label="Type de contrat" value={form.typeContrat ?? ''} onChange={(v) => set('typeContrat', v)} />
              <TextField label="N° CNSS" value={form.numeroCnss ?? ''} onChange={(v) => set('numeroCnss', v)} />
              <TextField label="N° D17" value={form.numeroD17 ?? ''} onChange={(v) => set('numeroD17', v)} />
              <TextField label="Numero banque / poste" value={form.numeroBanquePoste ?? ''} onChange={(v) => set('numeroBanquePoste', v)} />
            </Card>
            <Card title="Sante">
              <div>
                <label className="block text-xs font-medium text-navy/60 mb-1">Groupe sanguin</label>
                <select
                  value={form.groupeSanguin ?? ''}
                  onChange={(e) => set('groupeSanguin', (e.target.value || null) as GroupeSanguin | null)}
                  className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm text-navy bg-white"
                >
                  <option value="">—</option>
                  {GROUPES.map((g) => <option key={g} value={g}>{GROUPE_SANGUIN_LABELS[g]}</option>)}
                </select>
              </div>
              <NumberField label="Poids (kg)" value={form.poidsKg} onChange={(v) => set('poidsKg', v)} />
              <NumberField label="Hauteur (cm)" value={form.hauteurCm} onChange={(v) => set('hauteurCm', v)} />
              <TextField label="Pointure chaussure" value={form.pointureChaussure ?? ''} onChange={(v) => set('pointureChaussure', v)} />
              <TextField label="Taille vetements" value={form.tailleVetements ?? ''} onChange={(v) => set('tailleVetements', v)} />
              <div>
                <label className="block text-xs font-medium text-navy/60 mb-1">Tatouage</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-1.5 text-sm text-navy">
                    <input type="radio" checked={form.tatouage} onChange={() => set('tatouage', true)} /> Oui
                  </label>
                  <label className="flex items-center gap-1.5 text-sm text-navy">
                    <input type="radio" checked={!form.tatouage} onChange={() => set('tatouage', false)} /> Non
                  </label>
                </div>
              </div>
              <TextAreaField label="Maladies chroniques" value={form.maladiesChroniques ?? ''} onChange={(v) => set('maladiesChroniques', v)} />
              <TextAreaField label="Allergies" value={form.allergies ?? ''} onChange={(v) => set('allergies', v)} />
              <TextAreaField label="Operations" value={form.operations ?? ''} onChange={(v) => set('operations', v)} />
            </Card>
            <Card title="Emploi">
              <TextField label="Date d'embauche" type="date" value={form.dateEmbauche ?? ''} onChange={(v) => set('dateEmbauche', v)} />
              <TextField label="Experience" value={form.experience ?? ''} onChange={(v) => set('experience', v)} />
              <NumberField label="Salaire de depart" value={form.salaireDepart} onChange={(v) => set('salaireDepart', v)} />
              <NumberField label="Jours de conge autorises" value={form.nombreJoursConge} onChange={(v) => set('nombreJoursConge', v)} />
              <TextField label="GSM societe (MSD)" value={form.gsmSociete ?? ''} onChange={(v) => set('gsmSociete', v)} />
              <TextAreaField label="Societes et periodes de travail (experience)" value={form.societesEtPeriodes ?? ''} onChange={(v) => set('societesEtPeriodes', v)} />
            </Card>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            {successMessage && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{successMessage}</p>}
            <button
              type="submit"
              disabled={saving}
              className="self-start flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Enregistrer ma fiche
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}