import { useEffect, useState } from 'react';
import { Loader2, Image as ImageIcon, Send, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getFeed, createPost } from '../services/postService';
import type { Post } from '../types/post';
import PostCard, { Avatar } from '../components/post/PostCard';
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
            <PostCard key={post.id} post={post} onChanged={handleChanged} onRemoved={handleRemoved} />
          ))
        )}
      </div>
    </div>
  );
}