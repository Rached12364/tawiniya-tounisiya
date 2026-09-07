import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, User as UserIcon } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import type { AppNotification } from '../../types/notification';
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
function NotificationRow({ n, onRead }: { n: AppNotification; onRead: (id: number) => void }) {
  return (
    <Link
      to={targetPath(n)}
      onClick={() => !n.read && onRead(n.id)}
      className={`flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-navy/5 transition-colors ${!n.read ? 'bg-teal/5' : ''}`}
    >
      <div className="h-8 w-8 rounded-full bg-navy/10 overflow-hidden shrink-0">
        {n.actor.photoProfilPath ? (
          <img src={imageUrl(n.actor.photoProfilPath)} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-navy/30"><UserIcon size={14} /></div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-navy leading-snug">{n.message}</p>
        <p className="text-[11px] text-navy/40 mt-0.5">{timeAgo(n.createdAt)}</p>
      </div>
      {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-teal shrink-0" />}
    </Link>
  );
}
export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);
  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative grid place-items-center h-8 w-8 rounded-full hover:bg-white/70 transition-colors text-navy"
        aria-label="Notifications"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-red-600 text-white text-[9px] font-bold leading-[15px] text-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute top-full mt-3 end-0 z-30">
          <div className="absolute -top-1.5 end-4 h-3 w-3 rotate-45 bg-white border-t border-s border-navy/10 z-10" />
          <div className="relative w-80 max-h-[420px] overflow-y-auto rounded-lg bg-white text-navy shadow-xl border border-navy/10">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-navy/10 sticky top-0 bg-white">
              <h3 className="text-sm font-bold text-navy">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-[11px] font-semibold text-teal hover:text-teal/80 transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-navy/40 text-center py-8">Aucune notification pour le moment.</p>
            ) : (
              <div className="divide-y divide-navy/5">
                {notifications.map((n) => (
                  <NotificationRow key={n.id} n={n} onRead={markAsRead} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}