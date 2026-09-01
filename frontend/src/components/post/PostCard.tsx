import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon, Loader2, Send, ThumbsUp, Trash2, X, MessageCircle,
  MoreHorizontal, Pencil, Pin, Bookmark, Link as LinkIcon, Check,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import {
  reactToPost, getComments, addComment, deleteComment, reactToComment,
  updatePost, deletePost, togglePin, toggleSave,
} from '../../services/postService';
import type { Post, Comment, ReactionType } from '../../types/post';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path?: string) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
const ROLE_LABELS: Record<string, string> = {
  TECHNICIEN: 'Technicien', ENTREPRISE: 'Entreprise', CENTRE_FORMATION: 'Centre de formation',
  BENEFICIEL: 'Bénéficiaire', ADMIN: 'Administrateur',
};
const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'LIKE', emoji: '👍', label: "J'aime" },
  { type: 'COUP_DE_COEUR', emoji: '❤️', label: 'Coup de cœur' },
  { type: 'INSTRUCTIF', emoji: '⚡', label: 'Instructif' },
  { type: 'SOUTIEN', emoji: '🔧', label: 'Soutien' },
  { type: 'BRAVO', emoji: '🙌', label: 'Bravo' },
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
export function Avatar({ path, size = 40 }: { path?: string; size?: number }) {
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
function ReactionPicker({ onPick }: { onPick: (t: ReactionType) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  return (
    <div className="relative" ref={ref}>
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
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-navy/60 hover:text-teal transition-colors"
      >
        <ThumbsUp size={16} /> J'aime
      </button>
    </div>
  );
}
function CommentReactionPicker({ onPick }: { onPick: (t: ReactionType) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  return (
    <div className="relative inline-block" ref={ref}>
      {open && (
        <div className="absolute bottom-full mb-1 start-0 flex gap-1 bg-white rounded-full shadow-lg border border-navy/10 px-2 py-1 z-10">
          {REACTIONS.map((r) => (
            <button
              key={r.type}
              onClick={() => { onPick(r.type); setOpen(false); }}
              title={r.label}
              className="text-sm hover:scale-125 transition-transform"
            >
              {r.emoji}
            </button>
          ))}
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} className="text-xs font-semibold text-navy/50 hover:text-teal transition-colors">
        J'aime
      </button>
    </div>
  );
}
function CommentItem({ comment, postId, onReplyAdded, onUpdated, onDeleted, depth = 0 }: {
  comment: Comment;
  postId: number;
  onReplyAdded: (parentId: number, reply: Comment) => void;
  onUpdated: (updated: Comment) => void;
  onDeleted: (id: number, parentId: number | null) => void;
  depth?: number;
}) {
  const { user } = useAuthStore();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const topReactions = REACTIONS.filter((r) => (comment.reactionsCount[r.type] ?? 0) > 0).slice(0, 3);
  async function react(type: ReactionType) {
    const updated = await reactToComment(comment.id, type);
    onUpdated(updated);
  }
  async function submitReply() {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const reply = await addComment(postId, replyText.trim(), comment.id);
      onReplyAdded(comment.id, reply);
      setReplyText('');
      setReplying(false);
    } finally {
      setSendingReply(false);
    }
  }
  async function remove() {
    await deleteComment(comment.id);
    onDeleted(comment.id, comment.parentCommentId);
  }
  return (
    <div className="flex gap-2.5 items-start group">
      <Avatar path={comment.author.photoProfilPath} size={30} />
      <div className="flex-1 min-w-0">
        <div className="bg-navy/[0.03] rounded-xl px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-navy">{comment.author.prenom} {comment.author.nom}</p>
            {(comment.author.id === user?.id) && (
              <button onClick={remove} className="opacity-0 group-hover:opacity-100 text-navy/30 hover:text-red-500 transition-opacity">
                <Trash2 size={12} />
              </button>
            )}
          </div>
          <p className="text-sm text-navy/80 mt-0.5 whitespace-pre-line">{comment.content}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 px-1">
          {comment.myReaction ? (
            <button onClick={() => react(comment.myReaction as ReactionType)} className="text-xs font-semibold text-teal">
              {REACTIONS.find((r) => r.type === comment.myReaction)?.emoji} {REACTIONS.find((r) => r.type === comment.myReaction)?.label}
            </button>
          ) : (
            <CommentReactionPicker onPick={react} />
          )}
          {depth === 0 && (
            <button onClick={() => setReplying((v) => !v)} className="text-xs font-semibold text-navy/50 hover:text-teal transition-colors">
              Répondre
            </button>
          )}
          {comment.totalReactions > 0 && (
            <span className="flex items-center gap-1 text-xs text-navy/40">
              <span className="flex -space-x-0.5">{topReactions.map((r) => <span key={r.type}>{r.emoji}</span>)}</span>
              {comment.totalReactions}
            </span>
          )}
        </div>
        {replying && (
          <div className="flex gap-2 items-center mt-2">
            <Avatar path={user?.photoProfilPath} size={24} />
            <input
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitReply()}
              placeholder="Répondre..."
              className="flex-1 rounded-full border border-navy/15 px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
            />
            <button onClick={submitReply} disabled={sendingReply || !replyText.trim()} className="text-teal disabled:opacity-40">
              {sendingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 pl-2 border-l-2 border-navy/10 flex flex-col gap-2">
            {comment.replies.map((r) => (
              <CommentItem
                key={r.id}
                comment={r}
                postId={postId}
                onReplyAdded={onReplyAdded}
                onUpdated={onUpdated}
                onDeleted={onDeleted}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
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
  function handleReplyAdded(parentId: number, reply: Comment) {
    setComments((cs) => cs.map((c) => c.id === parentId
      ? { ...c, replies: [...(c.replies ?? []), reply] }
      : c
    ));
  }
  function handleUpdated(updated: Comment) {
    setComments((cs) => cs.map((c) => {
      if (c.id === updated.id) return { ...c, ...updated, replies: c.replies };
      if (c.replies) return { ...c, replies: c.replies.map((r) => r.id === updated.id ? { ...r, ...updated } : r) };
      return c;
    }));
  }
  function handleDeleted(id: number, parentId: number | null) {
    setComments((cs) => {
      if (!parentId) return cs.filter((c) => c.id !== id);
      return cs.map((c) => c.id === parentId
        ? { ...c, replies: (c.replies ?? []).filter((r) => r.id !== id) }
        : c
      );
    });
  }
  return (
    <div className="mt-3 pt-3 border-t border-navy/10 flex flex-col gap-3">
      {loading ? (
        <Loader2 size={16} className="animate-spin text-navy/30" />
      ) : (
        comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            postId={postId}
            onReplyAdded={handleReplyAdded}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
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
function PostMenu({ post, onEdit, onDelete, onTogglePin, onToggleSave }: {
  post: Post;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onToggleSave: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  function copyLink() {
    const url = `${window.location.origin}/actualites?post=${post.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="text-navy/30 hover:text-navy/60 transition-colors p-1">
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div className="absolute end-0 top-full mt-1 w-52 rounded-lg bg-white shadow-xl border border-navy/10 overflow-hidden z-20 py-1">
          <button onClick={() => { onToggleSave(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-navy hover:bg-navy/5 transition-colors">
            <Bookmark size={15} className={post.savedByMe ? 'fill-teal text-teal' : ''} />
            {post.savedByMe ? 'Retirer des enregistrés' : 'Enregistrer'}
          </button>
          <button onClick={copyLink} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-navy hover:bg-navy/5 transition-colors">
            {copied ? <Check size={15} className="text-teal" /> : <LinkIcon size={15} />}
            {copied ? 'Lien copié !' : 'Copier le lien'}
          </button>
          {post.canEdit && (
            <>
              <button onClick={() => { onTogglePin(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-navy hover:bg-navy/5 transition-colors">
                <Pin size={15} className={post.pinned ? 'fill-gold text-gold' : ''} />
                {post.pinned ? 'Désépingler du profil' : 'Épingler en haut du profil'}
              </button>
              <button onClick={() => { onEdit(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-navy hover:bg-navy/5 transition-colors">
                <Pencil size={15} /> Modifier
              </button>
              <button onClick={() => { onDelete(); setOpen(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 size={15} /> Supprimer
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default function PostCard({ post, onChanged, onRemoved }: {
  post: Post;
  onChanged: (p: Post) => void;
  onRemoved: (id: number) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const fullName = `${post.author.prenom} ${post.author.nom}`.trim();
  const topReactions = REACTIONS.filter((r) => (post.reactionsCount[r.type] ?? 0) > 0).slice(0, 3);
  async function handleReact(type: ReactionType) {
    const updated = await reactToPost(post.id, type);
    onChanged(updated);
  }
  async function handleDelete() {
    await deletePost(post.id);
    onRemoved(post.id);
  }
  async function handleTogglePin() {
    const updated = await togglePin(post.id);
    onChanged(updated);
  }
  async function handleToggleSave() {
    const updated = await toggleSave(post.id);
    onChanged(updated);
  }
  async function saveEdit() {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      const updated = await updatePost(post.id, editText.trim());
      onChanged(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      {post.pinned && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gold mb-2">
          <Pin size={12} className="fill-gold" /> Épinglé
        </div>
      )}
      <div className="flex items-start justify-between">
        <Link to={`/profil/${post.author.id}`} className="flex items-center gap-2.5 group">
          <Avatar path={post.author.photoProfilPath} />
          <div>
            <p className="text-sm font-semibold text-navy group-hover:text-teal transition-colors">{fullName}</p>
            <p className="text-xs text-navy/40">{ROLE_LABELS[post.author.role]} · {timeAgo(post.createdAt)}</p>
          </div>
        </Link>
        <PostMenu
          post={post}
          onEdit={() => { setEditText(post.content); setEditing(true); }}
          onDelete={handleDelete}
          onTogglePin={handleTogglePin}
          onToggleSave={handleToggleSave}
        />
      </div>
      {editing ? (
        <div className="mt-3">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-navy/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal resize-none"
          />
          <div className="flex gap-2 mt-2 justify-end">
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-sm font-medium text-navy/50 hover:text-navy px-3 py-1.5">
              <X size={14} /> Annuler
            </button>
            <button onClick={saveEdit} disabled={saving} className="flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-sm font-semibold text-navy-dark hover:bg-gold-light disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Enregistrer
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-navy whitespace-pre-line">{post.content}</p>
      )}
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
          <button onClick={() => handleReact(post.myReaction as ReactionType)} className="flex items-center gap-1.5 text-sm font-semibold text-teal">
            {REACTIONS.find((r) => r.type === post.myReaction)?.emoji}
            {REACTIONS.find((r) => r.type === post.myReaction)?.label}
          </button>
        ) : (
          <ReactionPicker onPick={handleReact} />
        )}
        <button onClick={() => setShowComments((v) => !v)} className="flex items-center gap-1.5 text-sm font-medium text-navy/60 hover:text-teal transition-colors">
          <MessageCircle size={16} /> {post.totalComments > 0 ? post.totalComments : ''} Commenter
        </button>
      </div>
      {showComments && <PostComments postId={post.id} />}
    </div>
  );
}