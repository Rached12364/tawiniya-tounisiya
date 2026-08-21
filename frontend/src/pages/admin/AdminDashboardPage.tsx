import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Home,
  MessageSquareWarning,
  Calendar,
  Scale,
  GraduationCap,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from 'lucide-react';
import StatsPanel from '../../components/admin/StatsPanel';
import UsersPanel from '../../components/admin/UsersPanel';
import ContentImagesPanel from '../../components/admin/ContentImagesPanel';
import ReclamationsPanel from '../../components/admin/ReclamationsPanel';
import EventsPanel from '../../components/admin/EventsPanel';
import JuridiquePanel from '../../components/admin/JuridiquePanel';
import CentreFormationAdminPanel from '../../components/admin/CentreFormationAdminPanel';
import { getStats } from '../../services/adminService';
import { getAllReclamations } from '../../services/reclamationService';
import { getAllEventsAdmin } from '../../services/eventService';
import { adminJuridiqueService } from '../../services/juridiqueService';
import { adminTrainingCenterService } from '../../services/trainingCenterService';
import { useAuthStore } from '../../store/authStore';
import { BRAND } from '../../config/brand';
type Tab = 'stats' | 'users' | 'content' | 'reclamations' | 'events' | 'juridique' | 'centreFormation';
const TABS: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'stats', label: 'Vue d\u2019ensemble', icon: LayoutDashboard },
  { key: 'users', label: 'Utilisateurs', icon: Users },
  { key: 'content', label: 'Accueil', icon: Home },
  { key: 'reclamations', label: 'Réclamations', icon: MessageSquareWarning },
  { key: 'events', label: 'Événements', icon: Calendar },
  { key: 'juridique', label: 'Juridique', icon: Scale },
  { key: 'centreFormation', label: 'Centre de formation', icon: GraduationCap },
];
const TAB_TITLES: Record<Tab, string> = {
  stats: 'Vue d\u2019ensemble',
  users: 'Utilisateurs',
  content: 'Accueil',
  reclamations: 'Réclamations',
  events: 'Événements',
  juridique: 'Juridique',
  centreFormation: 'Centre de formation',
};
function TabBadge({ count, collapsed }: { count: number; collapsed: boolean }) {
  if (!count || count <= 0) return null;
  if (collapsed) {
    return (
      <span className="absolute -top-1 -end-1 min-w-[16px] h-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-bold leading-[16px] text-center">
        {count > 99 ? '99+' : count}
      </span>
    );
  }
  return (
    <span className="ms-auto min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold leading-[18px] text-center">
      {count > 99 ? '99+' : count}
    </span>
  );
}
export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('stats');
  const [counts, setCounts] = useState<Partial<Record<Tab, number>>>({});
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  useEffect(() => {
    getStats()
      .then((s) => setCounts((c) => ({ ...c, users: s.totalUsers })))
      .catch(() => {});
    getAllReclamations('', 0, 1)
      .then((r) => setCounts((c) => ({ ...c, reclamations: r.totalElements })))
      .catch(() => {});
    getAllEventsAdmin(0, 1)
      .then((r) => setCounts((c) => ({ ...c, events: r.totalElements })))
      .catch(() => {});
    adminJuridiqueService
      .getAll()
      .then((sections) => setCounts((c) => ({ ...c, juridique: sections.length })))
      .catch(() => {});
    adminTrainingCenterService
      .list(0, 1)
      .then((r) => setCounts((c) => ({ ...c, centreFormation: r.totalElements })))
      .catch(() => {});
  }, []);
  const userInitial = (user?.prenom ?? user?.email ?? '?').charAt(0).toUpperCase();
  const userDisplayName = user ? `${user.prenom} ${user.nom}`.trim() : 'Admin';
  return (
    <div className="min-h-screen bg-navy/[0.02] flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-navy text-white flex flex-col shrink-0 transition-all duration-200 z-40 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo + brand */}
        <div className="flex items-center gap-3 px-5 h-20 shrink-0 bg-navy-dark border-b border-white/10">
          <div className="h-11 w-11 rounded-xl bg-white/10 ring-1 ring-white/10 flex items-center justify-center shrink-0">
            <img src={BRAND.logoSrc} alt={BRAND.nameAr} className="h-8 w-8 object-contain" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[15px] font-black tracking-tight text-white truncate">CTTEERA</p>
              <p className="text-[10px] font-semibold text-gold uppercase tracking-widest truncate">Admin Panel</p>
            </div>
          )}
        </div>
        {/* Admin info */}
        <div className={`px-3 py-4 border-b border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center gap-3 rounded-xl bg-white/5 hover:bg-white/[0.08] transition-colors p-2.5 ${collapsed ? 'justify-center' : ''}`}>
            <div className="relative shrink-0">
              <span className="h-10 w-10 rounded-full bg-gradient-to-br from-gold to-amber-500 text-navy-dark text-sm font-bold grid place-items-center ring-2 ring-white/10">
                {userInitial}
              </span>
              <span className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-navy" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{userDisplayName}</p>
                <p className="text-[11px] text-white/50 truncate">Administrateur</p>
              </div>
            )}
          </div>
        </div>
        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              title={collapsed ? label : undefined}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                collapsed ? 'justify-center' : ''
              } ${
                tab === key
                  ? 'bg-gold text-navy-dark font-semibold'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="relative shrink-0">
                <Icon size={18} />
                <TabBadge count={counts[key] ?? 0} collapsed={collapsed} />
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
              {!collapsed && <TabBadge count={counts[key] ?? 0} collapsed={false} />}
            </button>
          ))}
        </nav>
        {/* Bottom actions */}
        <div className="border-t border-white/10 p-2 flex flex-col gap-1">
          <button
            onClick={() => logout?.()}
            title={collapsed ? 'Se déconnecter' : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-red-300 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Se déconnecter</span>}
          </button>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && <span>Réduire</span>}
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main
        className={`flex-1 min-h-screen pt-8 pb-16 px-6 transition-all duration-200 ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-black text-navy mb-6">{TAB_TITLES[tab]}</h1>
          {tab === 'stats' && <StatsPanel />}
          {tab === 'users' && <UsersPanel />}
          {tab === 'content' && <ContentImagesPanel />}
          {tab === 'reclamations' && <ReclamationsPanel />}
          {tab === 'events' && <EventsPanel />}
          {tab === 'juridique' && <JuridiquePanel />}
          {tab === 'centreFormation' && <CentreFormationAdminPanel />}
        </div>
      </main>
    </div>
  );
}

