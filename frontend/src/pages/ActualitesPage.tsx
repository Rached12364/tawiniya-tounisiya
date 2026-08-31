import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Loader2, Image as ImageIcon, Send, X, User as UserIcon,
  Briefcase, MessageSquareWarning, Scale, Calendar,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getFeed, createPost } from '../services/postService';
import { browseByRole } from '../services/networkService';
import type { Post } from '../types/post';
import type { UserCard } from '../types/network';
import PostCard, { Avatar } from '../components/post/PostCard';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path?: string | null) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
const ROLE_LABELS: Record<string, string> = {
  TECHNICIEN: 'Technicien', ENTREPRISE: 'Entreprise', CENTRE_FORMATION: 'Centre de formation',
  BENEFICIEL: 'Bénéficiaire', ADMIN: 'Administrateur', EXPERT_JURIDIQUE: 'Expert Juridique',
};
const SPACE_PATH_BY_ROLE: Record<string, string> = {
  TECHNICIEN: '/espace/technicien',
  ENTREPRISE: '/espace/entreprise',
  CENTRE_FORMATION: '/espace/centre-formation',
  BENEFICIEL: '/espace/beneficiel',
};
function PostComposer({ onPosted }: { onPosted: (p: Post) => void }) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  function handleImage(file: File | null) {
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }
  async function submit() {
    if (!content.trim()) return;
    setPosting(true);
    try {
      const post = await createPost(content.trim(), image);
      onPosted(post);
      setContent('');
      handleImage(null);
    } finally {
      setPosting(false);
    }
  }
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-5">
      <div className="flex gap-3">
        <Avatar path={user?.photoProfilPath} />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Partagez une actualité, une réussite, une question..."
          rows={2}
          className="flex-1 rounded-lg border border-navy/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal resize-none"
        />
      </div>
      {preview && (
        <div className="relative mt-3 ms-[52px]">
          <img src={preview} alt="Aperçu" className="max-h-56 rounded-lg object-cover" />
          <button
            onClick={() => handleImage(null)}
            className="absolute top-1.5 end-1.5 grid place-items-center h-6 w-6 rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X size={13} />
          </button>
        </div>
      )}
      <div className="flex items-center justify-between mt-3 ms-[52px]">
        <label className="flex items-center gap-1.5 text-sm font-medium text-navy/60 hover:text-teal cursor-pointer transition-colors">
          <ImageIcon size={17} />
          Photo
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
            onChange={(e) => handleImage(e.target.files?.[0] ?? null)} />
        </label>
        <button
          onClick={submit}
          disabled={posting || !content.trim()}
          className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {posting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          Publier
        </button>
      </div>
    </div>
  );
}
function LeftSidebar() {
  const { user } = useAuthStore();
  if (!user) return null;
  const fullName = `${user.prenom} ${user.nom}`.trim();
  const spacePath = SPACE_PATH_BY_ROLE[user.role];
  const links = [
    ...(spacePath ? [{ label: `Espace ${ROLE_LABELS[user.role] ?? ''}`, path: spacePath, icon: Briefcase }] : []),
    { label: 'Mes réclamations', path: '/reclamation', icon: MessageSquareWarning },
    { label: 'Service Juridique', path: '/services/juridique', icon: Scale },
    { label: 'Événements', path: '/evenements', icon: Calendar },
  ];
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="h-14 bg-gradient-to-br from-navy to-teal overflow-hidden">
        {user.photoCouverturePath && (
          <img src={imageUrl(user.photoCouverturePath)} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="px-4 pb-4 -mt-7 flex flex-col items-center text-center">
        <div className="h-14 w-14 rounded-full border-4 border-white bg-navy/10 overflow-hidden shrink-0">
          {user.photoProfilPath ? (
            <img src={imageUrl(user.photoProfilPath)} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={20} /></div>
          )}
        </div>
        <p className="mt-2 text-sm font-bold text-navy truncate max-w-full">{fullName}</p>
        <p className="text-xs text-navy/50 truncate max-w-full">{ROLE_LABELS[user.role] ?? user.role} — CTTEERA</p>
      </div>
      <nav className="border-t border-navy/10 py-2">
        {links.map((l) => (
          <Link
            key={l.path}
            to={l.path}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-navy/70 hover:bg-navy/5 hover:text-teal transition-colors"
          >
            <l.icon size={15} className="shrink-0" />
            <span className="truncate">{l.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
function MiniCard({ card }: { card: UserCard }) {
  const fullName = `${card.prenom} ${card.nom}`.trim();
  return (
    <Link
      to={`/profil/${card.id}`}
      className="flex items-center gap-2.5 py-2 hover:bg-navy/[0.03] rounded-lg px-1.5 -mx-1.5 transition-colors"
    >
      <div className="h-9 w-9 rounded-full bg-navy/10 overflow-hidden shrink-0">
        {card.photoProfilPath ? (
          <img src={imageUrl(card.photoProfilPath)} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={16} /></div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-navy truncate">{fullName}</p>
        <p className="text-[11px] text-navy/40 truncate">{card.adresse || card.subtitle || ROLE_LABELS[card.role]}</p>
      </div>
    </Link>
  );
}
function RightSidebar() {
  const { user } = useAuthStore();
  const [experts, setExperts] = useState<UserCard[]>([]);
  const [suggestions, setSuggestions] = useState<UserCard[]>([]);
  useEffect(() => {
    browseByRole('EXPERT_JURIDIQUE', 0, 3).then((res) => setExperts(res.content)).catch(() => {});
  }, []);
  useEffect(() => {
    if (!user || user.role === 'ADMIN' || user.role === 'EXPERT_JURIDIQUE') return;
    browseByRole(user.role, 0, 3).then((res) => setSuggestions(res.content)).catch(() => {});
  }, [user]);
  if (experts.length === 0 && suggestions.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      {experts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-xs font-bold text-teal uppercase tracking-wide mb-1.5">Experts Juridiques</h3>
          <div className="flex flex-col divide-y divide-navy/5">
            {experts.map((c) => <MiniCard key={c.id} card={c} />)}
          </div>
          <Link to="/services/juridique" className="block mt-2 text-xs font-semibold text-teal hover:text-teal/80 transition-colors">
            Voir tous les experts
          </Link>
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-xs font-bold text-teal uppercase tracking-wide mb-1.5">Suggestions</h3>
          <div className="flex flex-col divide-y divide-navy/5">
            {suggestions.map((c) => <MiniCard key={c.id} card={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}
export default function ActualitesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getFeed(0, 20)
      .then((res) => setPosts(res.content))
      .catch(() => setError('Impossible de charger le fil.'))
      .finally(() => setLoading(false));
  }, []);
  function handlePosted(post: Post) {
    setPosts((ps) => [post, ...ps]);
  }
  function handleChanged(updated: Post) {
    setPosts((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
  }
  function handleRemoved(postId: number) {
    setPosts((ps) => ps.filter((p) => p.id !== postId));
  }
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-6 items-start">
        <aside className="hidden lg:block lg:sticky lg:top-24">
          <LeftSidebar />
        </aside>
        <div className="min-w-0 lg:h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
          <h1 className="text-2xl font-black text-navy mb-1">Fil d'actualité</h1>
          <p className="text-sm text-navy/50 mb-6">Partagez et échangez avec la communauté CTTEERA.</p>
          <PostComposer onPosted={handlePosted} />
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
          {loading ? (
            <div className="grid place-items-center py-16"><Loader2 className="animate-spin text-navy/40" size={28} /></div>
          ) : posts.length === 0 ? (
            <p className="text-navy/50 text-sm text-center py-10">Aucune publication pour le moment. Soyez le premier à partager !</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onChanged={handleChanged} onRemoved={handleRemoved} />
            ))
          )}
        </div>
        <aside className="hidden lg:block lg:sticky lg:top-24">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
}