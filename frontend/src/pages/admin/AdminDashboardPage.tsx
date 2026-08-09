import { useState } from 'react';
import { LayoutDashboard, Users, Image as ImageIcon, MessageSquareWarning, Calendar } from 'lucide-react';
import StatsPanel from '../../components/admin/StatsPanel';
import UsersPanel from '../../components/admin/UsersPanel';
import ContentImagesPanel from '../../components/admin/ContentImagesPanel';
import ReclamationsPanel from '../../components/admin/ReclamationsPanel';
import EventsPanel from '../../components/admin/EventsPanel';
type Tab = 'stats' | 'users' | 'content' | 'reclamations' | 'events';
const TABS: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'stats', label: 'Vue d\u2019ensemble', icon: LayoutDashboard },
  { key: 'users', label: 'Utilisateurs', icon: Users },
  { key: 'content', label: 'Accueil', icon: ImageIcon },
  { key: 'reclamations', label: 'Réclamations', icon: MessageSquareWarning },
  { key: 'events', label: 'Événements', icon: Calendar },
];
export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('stats');
  return (
    <div className="min-h-[70vh] bg-navy/[0.02] pt-28 pb-16 px-4">
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
            </button>
          ))}
        </div>
        {tab === 'stats' && <StatsPanel />}
        {tab === 'users' && <UsersPanel />}
        {tab === 'content' && <ContentImagesPanel />}
        {tab === 'reclamations' && <ReclamationsPanel />}
        {tab === 'events' && <EventsPanel />}
      </div>
    </div>
  );
}