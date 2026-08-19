import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon, Loader2, Image as ImageIcon, Send, ThumbsUp,
  Trash2, X, MessageCircle,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getFeed, createPost, deletePost, reactToPost, getComments, addComment, deleteComment } from '../services/postService';
import type { Post, Comment, ReactionType } from '../types/post';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path?: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
const ROLE_LABELS: Record<string, string> = {
  TECHNICIEN: 'Technicien', ENTREPRISE: 'Entreprise', STAGIAIRE: 'Stagiaire',
  BENEFICIEL: 'Bénéficiaire', ADMIN: 'Administrateur',
};
const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'LIKE', emoji: '👍', label: "J'aime" },
  { type: 'BRAVO', emoji: '👏', label: 'Bravo' },
  { type: 'SOUTIEN', emoji: '🤝', label: 'Soutien' },
  { type: 'COUP_DE_COEUR', emoji: '❤️', label: 'Coup de cœur' },
  { type: 'INSTRUCTIF', emoji: '💡', label: 'Instructif' },
];
function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} j`;
}
function Avatar({ path, size = 40 }: { path?: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-navy/10 overflow-hidden shrink-0 grid place-items-center"
    >
      {path ? (
        <img src={imageUrl(path)} alt="" className="w-full h-full object-cover" />
      ) : (
        <UserIcon size={size * 0.5} className="text-navy/30" />
      )}
    </div>
  );
}
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
function ReactionPicker({ onPick }: { onPick: (t: ReactionType) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {open && (
        <div className="absolute bottom-full mb-1 start-0 flex gap-1 bg-white rounded-full shadow-lg border border-navy/10 px-2 py-1.5 z-10">
          {REACTIONS.map((r) => (
            <button
              key={r.type}
              onClick={() => { onPick(r.type); setOpen(false); }}
              title={r.label}
              className="text-lg hover:scale-125 transition-transform"
            >
              {r.emoji}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => onPick('LIKE')}
        className="flex items-center gap-1.5 text-sm font-medium text-navy/60 hover:text-teal transition-colors"
      >
        <ThumbsUp size={16} /> J'aime
      </button>
    </div>
  );
}
function PostComments({ postId }: { postId: number }) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  useEffect(() => {
    getComments(postId).then(setComments).finally(() => setLoading(false));
  }, [postId]);
  async function submit() {
    if (!text.trim()) return;
    setSending(true);
    try {
      const c = await addComment(postId, text.trim());
      setComments((cs) => [...cs, c]);
      setText('');
    } finally {
      setSending(false);
    }
  }
  async function remove(commentId: number) {
    await deleteComment(commentId);
    setComments((cs) => cs.filter((c) => c.id !== commentId));
  }
  return (
    <div className="mt-3 pt-3 border-t border-navy/10 flex flex-col gap-3">
      {loading ? (
        <Loader2 size={16} className="animate-spin text-navy/30" />
      ) : (
        comments.map((c) => (
          <div key={c.id} className="flex gap-2.5 items-start group">
            <Avatar path={c.author.photoProfilPath} size={30} />
            <div className="flex-1 min-w-0 bg-navy/[0.03] rounded-xl px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-navy">{c.author.prenom} {c.author.nom}</p>
                {(c.author.id === user?.id) && (
                  <button onClick={() => remove(c.id)} className="opacity-0 group-hover:opacity-100 text-navy/30 hover:text-red-500 transition-opacity">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <p className="text-sm text-navy/80 mt-0.5 whitespace-pre-line">{c.content}</p>
            </div>
          </div>
        ))
      )}
      <div className="flex gap-2.5 items-center">
        <Avatar path={user?.photoProfilPath} size={30} />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Écrire un commentaire..."
          className="flex-1 rounded-full border border-navy/15 px-3.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
        />
        <button onClick={submit} disabled={sending || !text.trim()} className="text-teal disabled:opacity-40">
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
function PostCard({ post, onDelete, onReact }: {
  post: Post;
  onDelete: (id: number) => void;
  onReact: (id: number, type: ReactionType) => void;
}) {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const fullName = `${post.author.prenom} ${post.author.nom}`.trim();
  const canDelete = post.author.id === user?.id || user?.role === 'ADMIN';
  const topReactions = REACTIONS.filter((r) => (post.reactionsCount[r.type] ?? 0) > 0).slice(0, 3);
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-start justify-between">
        <Link to={`/profil/${post.author.id}`} className="flex items-center gap-2.5 group">
          <Avatar path={post.author.photoProfilPath} />
          <div>
            <p className="text-sm font-semibold text-navy group-hover:text-teal transition-colors">{fullName}</p>
            <p className="text-xs text-navy/40">{ROLE_LABELS[post.author.role]} · {timeAgo(post.createdAt)}</p>
          </div>
        </Link>
        {canDelete && (
          <button onClick={() => onDelete(post.id)} className="text-navy/30 hover:text-red-500 transition-colors p-1">
            <Trash2 size={15} />
          </button>
        )}
      </div>
      <p className="mt-3 text-sm text-navy whitespace-pre-line">{post.content}</p>
      {post.imagePath && (
        <img src={imageUrl(post.imagePath)} alt="" className="mt-3 w-full max-h-96 object-cover rounded-lg" />
      )}
      {post.totalReactions > 0 && (
        <div className="flex items-center gap-1.5 mt-3 text-xs text-navy/50">
          <span className="flex -space-x-1">
            {topReactions.map((r) => <span key={r.type}>{r.emoji}</span>)}
          </span>
          {post.totalReactions}
        </div>
      )}
      <div className="flex items-center gap-5 mt-2 pt-2 border-t border-navy/10">
        {post.myReaction ? (
          <button
            onClick={() => onReact(post.id, post.myReaction as ReactionType)}
            className="flex items-center gap-1.5 text-sm font-semibold text-teal"
          >
            {REACTIONS.find((r) => r.type === post.myReaction)?.emoji}
            {REACTIONS.find((r) => r.type === post.myReaction)?.label}
          </button>
        ) : (
          <ReactionPicker onPick={(t) => onReact(post.id, t)} />
        )}
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-navy/60 hover:text-teal transition-colors"
        >
          <MessageCircle size={16} /> {post.totalComments > 0 ? post.totalComments : ''} Commenter
        </button>
      </div>
      {showComments && <PostComments postId={post.id} />}
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
  async function handleDelete(postId: number) {
    await deletePost(postId);
    setPosts((ps) => ps.filter((p) => p.id !== postId));
  }
  async function handleReact(postId: number, type: ReactionType) {
    const updated = await reactToPost(postId, type);
    setPosts((ps) => ps.map((p) => (p.id === postId ? updated : p)));
  }
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-28 pb-16 px-4">
      <div className="mx-auto max-w-2xl">
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
            <PostCard key={post.id} post={post} onDelete={handleDelete} onReact={handleReact} />
          ))
        )}
      </div>
    </div>
  );
}