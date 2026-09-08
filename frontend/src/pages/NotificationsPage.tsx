import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User as UserIcon, Loader2 } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { getNotifications } from '../services/notificationService';
import type { AppNotification, NotificationType } from '../types/notification';
const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/api\/?$/, '');
function imageUrl(path?: string | null) {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_ORIGIN}${path}`;
}
function targetPath(n: AppNotification): string {
  if (n.postId) return `/actualites#post-${n.postId}`;
  return '/actualites';
}
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
}
type FilterKey = 'ALL' | 'POSTS' | 'COMMENTS' | 'REACTIONS';
const FILTERS: { key: FilterKey; label: string; types: NotificationType[] | null }[] = [
  { key: 'ALL', label: 'Tout', types: null },
  { key: 'POSTS', label: 'Publications', types: ['NEW_POST'] },
  { key: 'COMMENTS', label: 'Commentaires', types: ['COMMENT_POST', 'REPLY_COMMENT'] },
  { key: 'REACTIONS', label: 'Réactions', types: ['LIKE_POST', 'LIKE_COMMENT'] },
];
function NotificationRow({ n, onRead }: { n: AppNotification; onRead: (id: number) => void }) {
  return (
    <Link
      to={targetPath(n)}
      onClick={() => !n.read && onRead(n.id)}
      className={`flex items-start gap-3 px-4 py-3.5 border-b border-navy/5 last:border-b-0 hover:bg-navy/[0.03] transition-colors ${!n.read ? 'bg-teal/5' : ''}`}
    >
      <div className="h-11 w-11 rounded-full bg-navy/10 overflow-hidden shrink-0">
        {n.actor.photoProfilPath ? (
          <img src={imageUrl(n.actor.photoProfilPath)} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={18} /></div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-navy leading-snug">{n.message}</p>
        <p className="text-xs text-navy/40 mt-1">{timeAgo(n.createdAt)}</p>
      </div>
      {!n.read && <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-teal shrink-0" />}
    </Link>
  );
}
export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<FilterKey>('ALL');
  const [extra, setExtra] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => {
    setExtra([]);
    setPage(0);
    setHasMore(true);
  }, []);
  const allNotifications = useMemo(() => {
    const seen = new Set(notifications.map((n) => n.id));
    return [...notifications, ...extra.filter((n) => !seen.has(n.id))];
  }, [notifications, extra]);
  const activeFilter = FILTERS.find((f) => f.key === filter)!;
  const filtered = activeFilter.types
    ? allNotifications.filter((n) => activeFilter.types!.includes(n.type))
    : allNotifications;
  async function loadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getNotifications(nextPage, 20);
      setExtra((prev) => [...prev, ...result.content]);
      setPage(nextPage);
      setHasMore(nextPage + 1 < result.totalPages);
    } catch {
      // silencieux
    } finally {
      setLoadingMore(false);
    }
  }
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-8 pb-16 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-5">
          <h1 className="flex items-center gap-2 text-2xl font-black text-navy">
            <Bell size={22} /> Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-sm font-semibold text-teal hover:text-teal/80 transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
        <div className="flex gap-1 rounded-full bg-white shadow-sm p-1 mb-5 w-fit">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === f.key ? 'bg-navy text-white' : 'text-navy/50 hover:text-navy'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-sm text-navy/40 text-center py-12">Aucune notification pour le moment.</p>
          ) : (
            filtered.map((n) => <NotificationRow key={n.id} n={n} onRead={markAsRead} />)
          )}
        </div>
        {hasMore && filtered.length > 0 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 rounded-full bg-white shadow-sm px-5 py-2 text-sm font-semibold text-navy/70 hover:text-teal transition-colors disabled:opacity-50"
            >
              {loadingMore && <Loader2 size={14} className="animate-spin" />}
              Charger plus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}