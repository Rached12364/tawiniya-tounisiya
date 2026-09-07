import { useEffect, useState } from 'react';
import { Users, ShieldAlert, UserCog, Wrench, Building2, GraduationCap, HeartHandshake, Shield, Scale } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { getStats } from '../../services/adminService';
import type { AdminStats } from '../../types/admin';
import UserGrowthChart from './UserGrowthChart';
const ROLE_META: Record<string, { label: string; icon: typeof Wrench; color: string; bg: string; hex: string }> = {
  ADMIN: { label: 'Admins', icon: Shield, color: 'text-navy', bg: 'bg-navy/10', hex: '#1B3A5C' },
  TECHNICIEN: { label: 'Techniciens', icon: Wrench, color: 'text-teal', bg: 'bg-teal/10', hex: '#0D9488' },
  ENTREPRISE: { label: 'Entreprises', icon: Building2, color: 'text-gold', bg: 'bg-gold/15', hex: '#C9A227' },
  CENTRE_FORMATION: { label: 'Centres de formation', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-100', hex: '#9333ea' },
  BENEFICIEL: { label: 'Bénéficiaires', icon: HeartHandshake, color: 'text-rose-600', bg: 'bg-rose-100', hex: '#e11d48' },
  EXPERT_JURIDIQUE: { label: 'Experts juridiques', icon: Scale, color: 'text-teal-light', bg: 'bg-teal-light/15', hex: '#14B8A6' },
};
const FALLBACK_HEX = '#64748b';
export default function StatsPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError('Impossible de charger les statistiques.'))
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-navy/5 animate-pulse" />
        ))}
      </div>
    );
  }
  if (error || !stats) {
    return <p className="text-red-600">{error ?? 'Erreur inconnue.'}</p>;
  }
  const roleEntries = Object.entries(stats.usersByRole);
  const maxCount = Math.max(...roleEntries.map(([, c]) => c), 1);
  return (
    <div className="flex flex-col gap-4">
    <UserGrowthChart />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="group rounded-xl border border-navy/10 bg-white p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-navy/20 transition-all">
        <div className="grid place-items-center h-12 w-12 rounded-full bg-navy/10 text-navy group-hover:scale-105 transition-transform">
          <Users size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold text-navy">{stats.totalUsers}</p>
          <p className="text-sm text-navy/60">Utilisateurs au total</p>
        </div>
      </div>
      <div className="group rounded-xl border border-navy/10 bg-white p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-red-200 transition-all">
        <div className="grid place-items-center h-12 w-12 rounded-full bg-red-100 text-red-600 group-hover:scale-105 transition-transform">
          <ShieldAlert size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold text-navy">{stats.failedLoginAttempts}</p>
          <p className="text-sm text-navy/60">Connexions échouées</p>
        </div>
      </div>
      <div className="sm:col-span-2 lg:col-span-2 rounded-xl border border-navy/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-4 text-navy">
          <UserCog size={18} />
          <p className="text-sm font-semibold">Répartition par rôle</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
          <div className="w-full sm:w-36 h-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleEntries.filter(([, c]) => c > 0).map(([role, count]) => ({ name: ROLE_META[role]?.label ?? role, value: count, role }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  outerRadius="90%"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {roleEntries.filter(([, c]) => c > 0).map(([role]) => (
                    <Cell key={role} fill={ROLE_META[role]?.hex ?? FALLBACK_HEX} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #0f172a15', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 min-w-0 w-full flex flex-col gap-2.5">
          {roleEntries.map(([role, count]) => {
            const meta = ROLE_META[role] ?? { label: role, icon: Users, color: 'text-navy', bg: 'bg-navy/5' };
            const Icon = meta.icon;
            const pct = Math.round((count / maxCount) * 100);
            return (
              <div key={role} className="flex items-center gap-3">
                <div className={`grid place-items-center h-8 w-8 rounded-lg shrink-0 ${meta.bg} ${meta.color}`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-medium text-navy/70 truncate">{meta.label}</p>
                    <p className="text-sm font-bold text-navy">{count}</p>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-navy/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${meta.color.replace('text-', 'bg-')} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
