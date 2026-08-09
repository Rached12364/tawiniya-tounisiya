import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Image as ImageIcon, MessageSquareWarning, Calendar, Scale, GraduationCap } from 'lucide-react';
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
type Tab = 'stats' | 'users' | 'content' | 'reclamations' | 'events' | 'juridique' | 'centreFormation';
const TABS: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'stats', label: 'Vue d\u2019ensemble', icon: LayoutDashboard },
  { key: 'users', label: 'Utilisateurs', icon: Users },
  { key: 'content', label: 'Accueil', icon: ImageIcon },
  { key: 'reclamations', label: 'Réclamations', icon: MessageSquareWarning },
  { key: 'events', label: 'Événements', icon: Calendar },
  { key: 'juridique', label: 'Juridique', icon: Scale },
  { key: 'centreFormation', label: 'Centre de formation', icon: GraduationCap },
];
function TabBadge({ count }: { count: number }) {
  if (!count || count <= 0) return null;
  return (
    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold leading-[18px] text-center">
      {count > 99 ? '99+' : count}
    </span>
  );
}
export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('stats');
  const [counts, setCounts] = useState<Partial<Record<Tab, number>>>({});
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
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-44 pb-16 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-black text-navy mb-6">Tableau de bord administrateur</h1>
        <div className="flex gap-2 mb-6 border-b border-navy/10">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                tab === key
                  ? 'border-gold text-navy'
                  : 'border-transparent text-navy/50 hover:text-navy'
              }`}
            >
              <Icon size={16} />
              {label}
              <TabBadge count={counts[key] ?? 0} />
            </button>
          ))}
        </div>
        {tab === 'stats' && <StatsPanel />}
        {tab === 'users' && <UsersPanel />}
        {tab === 'content' && <ContentImagesPanel />}
        {tab === 'reclamations' && <ReclamationsPanel />}
        {tab === 'events' && <EventsPanel />}
        {tab === 'juridique' && <JuridiquePanel />}
        {tab === 'centreFormation' && <CentreFormationAdminPanel />}
      </div>
    </div>
  );
}