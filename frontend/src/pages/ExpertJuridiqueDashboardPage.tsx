import { useEffect, useState } from 'react';
import {
  LayoutDashboard, MessageSquareWarning, LogOut, Camera, Image as ImageIcon, Loader2, User as UserIcon,
  UserCog, Check, X, Pencil, FileText, Paperclip,
} from 'lucide-react';
import { getMyUserProfile, updateMyUserProfile, uploadMyPhotoProfil, uploadMyPhotoCouverture, uploadDiplomeDocument } from '../services/userProfileService';
import { getMyConversations } from '../services/expertConversationService';
import ExpertConversationThread from '../components/ExpertConversationThread';
import type { ExpertConversationSummary } from '../types/expertConversation';
import { useAuthStore } from '../store/authStore';
import { BRAND } from '../config/brand';
import type { User } from '../types/auth';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path?: string | null) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
type Tab = 'dashboard' | 'reclamation' | 'profil';
const TABS: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'reclamation', label: 'Réclamation', icon: MessageSquareWarning },
];
const inputCls = "w-full rounded-lg border border-blue-900/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500";
interface ProfilFormState {
  nom: string;
  prenom: string;
  phone: string;
  adresse: string;
  bio: string;
}
function emptyForm(): ProfilFormState {
  return { nom: '', prenom: '', phone: '', adresse: '', bio: '' };
}
function ProfilTab({ user, onSaved }: { user: User; onSaved: (u: User) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfilFormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diplomeUploading, setDiplomeUploading] = useState(false);
  useEffect(() => {
    setForm({
      nom: user.nom ?? '',
      prenom: user.prenom ?? '',
      phone: user.phone ?? '',
      adresse: user.adresse ?? '',
      bio: user.bio ?? '',
    });
  }, [user]);
  const startEdit = () => setEditing(true);
  const cancel = () => {
    setForm({
      nom: user.nom ?? '',
      prenom: user.prenom ?? '',
      phone: user.phone ?? '',
      adresse: user.adresse ?? '',
      bio: user.bio ?? '',
    });
    setEditing(false);
  };
  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateMyUserProfile(form);
      onSaved(updated);
      setEditing(false);
    } catch {
      setError("Impossible d'enregistrer les modifications.");
    } finally {
      setSaving(false);
    }
  };
  async function handleDiplomeUpload(file: File | null) {
    if (!file) return;
    setDiplomeUploading(true);
    setError(null);
    try {
      const updated = await uploadDiplomeDocument(file);
      onSaved(updated);
    } catch {
      setError("Échec de l'envoi du document.");
    } finally {
      setDiplomeUploading(false);
    }
  }
  const fields: { key: keyof ProfilFormState; label: string; textarea?: boolean }[] = [
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'phone', label: 'Téléphone (contact)' },
    { key: 'adresse', label: 'Adresse du cabinet' },
    { key: 'bio', label: 'Bio', textarea: true },
  ];
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">Mes informations</h3>
          {!editing ? (
            <button onClick={startEdit} className="text-blue-900/40 hover:text-blue-700 transition-colors p-1.5 rounded-full hover:bg-blue-50">
              <Pencil size={15} />
            </button>
          ) : (
            <div className="flex gap-1.5">
              <button onClick={cancel} className="text-blue-900/40 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50">
                <X size={15} />
              </button>
              <button onClick={save} disabled={saving} className="text-blue-700 hover:text-blue-800 transition-colors p-1.5 rounded-full hover:bg-blue-50 disabled:opacity-50">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              </button>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {fields.map((f) => (
              <div key={f.key} className={f.textarea ? 'sm:col-span-2' : ''}>
                <p className="text-[11px] text-blue-900/40 font-semibold uppercase tracking-wide">{f.label}</p>
                <p className="text-sm text-blue-900 mt-0.5 whitespace-pre-line">{form[f.key] || '—'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={f.textarea ? 'sm:col-span-2' : ''}>
                <label className="block text-[11px] font-medium text-blue-900/60 mb-1">{f.label}</label>
                {f.textarea ? (
                  <textarea
                    value={form[f.key]}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    rows={3}
                    className={inputCls}
                  />
                ) : (
                  <input
                    value={form[f.key]}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    className={inputCls}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-4">Diplôme</h3>
        {user.diplomeDocumentPath ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-900/10 bg-blue-50/50 px-4 py-3">
            <a
              href={imageUrl(user.diplomeDocumentPath)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
            >
              <FileText size={16} /> Voir le document envoyé
            </a>
            <label className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 cursor-pointer transition-colors">
              {diplomeUploading ? <Loader2 size={13} className="animate-spin" /> : <Paperclip size={13} />}
              Remplacer
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => handleDiplomeUpload(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-900/15 px-4 py-6 text-sm text-blue-900/50 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-colors">
            {diplomeUploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
            Choisir un fichier (JPG, PNG, WEBP ou PDF)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={(e) => handleDiplomeUpload(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>
    </div>
  );
}
export default function ExpertJuridiqueDashboardPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ExpertConversationSummary[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const { logout } = useAuthStore();
  useEffect(() => {
    getMyUserProfile().then(setUser).catch(() => {});
  }, []);
  function loadConversations() {
    setConversationsLoading(true);
    getMyConversations()
      .then((list) => {
        setConversations(list);
        if (list.length > 0 && selectedConversationId === null) {
          setSelectedConversationId(list[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setConversationsLoading(false));
  }
  useEffect(() => {
    if (tab === 'reclamation') loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);
  async function handlePhotoProfil(file: File | null) {
    if (!file) return;
    setUploadingKey('photoProfil');
    try {
      const updated = await uploadMyPhotoProfil(file);
      setUser(updated);
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
    } finally {
      setUploadingKey(null);
    }
  }
  const fullName = user ? `${user.prenom} ${user.nom}`.trim() : 'Expert Juridique';
  const TAB_TITLES: Record<Tab, string> = {
    dashboard: 'Dashboard',
    reclamation: 'Réclamation',
    profil: 'Profil',
  };
  return (
    <div className="min-h-screen bg-blue-50/40 flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-blue-950 text-white flex flex-col shrink-0 z-40">
        <div className="flex items-center gap-3 px-5 h-20 shrink-0 bg-black/30 border-b border-white/10">
          <div className="h-11 w-11 rounded-xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center shrink-0">
            <img src={BRAND.logoSrc} alt={BRAND.nameAr} className="h-8 w-8 object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-black tracking-tight text-white truncate">CTTEERA</p>
            <p className="text-[10px] font-semibold text-yellow-300 uppercase tracking-widest truncate">Expert Juridique</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                tab === key ? 'bg-yellow-400 text-blue-900 font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-2 flex flex-col gap-1">
          <button
            onClick={() => setTab('profil')}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === 'profil' ? 'bg-yellow-400 text-blue-900 font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {user?.photoProfilPath ? (
              <span className="h-[18px] w-[18px] rounded-full overflow-hidden shrink-0 ring-1 ring-white/30">
                <img src={imageUrl(user.photoProfilPath)} alt="" className="w-full h-full object-cover" />
              </span>
            ) : (
              <UserCog size={18} className="shrink-0" />
            )}
            <span>Profil</span>
          </button>
          <button
            onClick={() => logout?.()}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-red-300 transition-colors w-full"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 min-h-screen ml-64">
        {/* Profil header */}
        <div className="relative h-40 w-full bg-gradient-to-br from-blue-950 to-blue-800 overflow-hidden">
          {user?.photoCouverturePath && (
            <img src={imageUrl(user.photoCouverturePath)} alt="Couverture" className="w-full h-full object-cover" />
          )}
          <label className="absolute bottom-3 end-4 grid place-items-center h-9 w-9 rounded-full bg-white/90 hover:bg-white cursor-pointer shadow transition-colors">
            {uploadingKey === 'photoCouverture' ? (
              <Loader2 size={15} className="animate-spin text-blue-700" />
            ) : (
              <ImageIcon size={15} className="text-blue-700" />
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={(e) => handlePhotoCouverture(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <div className="px-8 -mt-10 mb-6 flex items-end gap-4">
          <div className="relative h-24 w-24 rounded-full border-4 border-white bg-blue-100 overflow-hidden shrink-0">
            {user?.photoProfilPath ? (
              <img src={imageUrl(user.photoProfilPath)} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-blue-300"><UserIcon size={30} /></div>
            )}
            <label className="absolute inset-0 grid place-items-center bg-black/0 hover:bg-black/30 transition-colors cursor-pointer group">
              {uploadingKey === 'photoProfil' ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <Camera size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={(e) => handlePhotoProfil(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className="pb-1">
            <h1 className="text-xl font-black text-blue-900">{fullName}</h1>
            <p className="text-sm text-blue-600/70">{user?.gouvernorat ?? ''} — Expert Juridique CTTEERA</p>
          </div>
        </div>
        {/* Contenu */}
        <div className="px-8 pb-16">
          <h2 className="text-lg font-bold text-blue-900 mb-4">{TAB_TITLES[tab]}</h2>
          {tab === 'profil' && user ? (
            <ProfilTab user={user} onSaved={setUser} />
          ) : tab === 'reclamation' ? (
            conversationsLoading ? (
              <div className="bg-white rounded-xl shadow-sm p-10 grid place-items-center">
                <Loader2 className="animate-spin text-blue-400" size={22} />
              </div>
            ) : conversations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center text-blue-900/40 text-sm">
                Aucun message pour le moment.
              </div>
            ) : (
              <div className="flex gap-4" style={{ height: '600px' }}>
                <div className="w-72 shrink-0 bg-white rounded-xl shadow-sm overflow-y-auto flex flex-col">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`text-left px-4 py-3 border-b border-blue-900/5 transition-colors ${
                        selectedConversationId === conv.id ? 'bg-blue-50' : 'hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-blue-900 truncate">{conv.otherUser.prenom} {conv.otherUser.nom}</p>
                        <span className={`shrink-0 text-[9px] font-semibold rounded-full px-1.5 py-0.5 ${
                          conv.status === 'RESOLUE' ? 'bg-teal-100 text-teal-700' : conv.status === 'EN_COURS' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {conv.status === 'RESOLUE' ? 'Résolue' : conv.status === 'EN_COURS' ? 'En cours' : 'Ouverte'}
                        </span>
                      </div>
                      <p className="text-xs text-blue-900/50 truncate mt-0.5">{conv.lastMessagePreview || conv.subject}</p>
                    </button>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  {selectedConversationId && (
                    <ExpertConversationThread conversationId={selectedConversationId} onStatusChanged={loadConversations} />
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center text-blue-900/40 text-sm">
              Cette page est en cours de construction.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}