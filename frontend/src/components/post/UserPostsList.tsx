import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { getPostsByAuthor } from '../../services/postService';
import PostCard from './PostCard';
import type { Post } from '../../types/post';
export default function UserPostsList({ authorId }: { authorId: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getPostsByAuthor(authorId, 0, 20)
      .then((res) => setPosts(res.content))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [authorId]);
  function handleChanged(updated: Post) {
    setPosts((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
  }
  function handleRemoved(id: number) {
    setPosts((ps) => ps.filter((p) => p.id !== id));
  }
  if (loading) {
    return <div className="grid place-items-center py-10"><Loader2 className="animate-spin text-navy/30" size={22} /></div>;
  }
  if (posts.length === 0) {
    return <p className="text-sm text-navy/40 py-6 text-center">Aucune publication pour le moment.</p>;
  }
  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onChanged={handleChanged} onRemoved={handleRemoved} />
      ))}
    </div>
  );
}