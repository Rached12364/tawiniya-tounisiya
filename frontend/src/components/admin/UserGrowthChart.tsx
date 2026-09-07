import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { getUserGrowth } from '../../services/adminService';
import type { UserGrowthPoint } from '../../types/admin';
function formatMonth(month: string): string {
  const [year, m] = month.split('-');
  const labels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
  const idx = parseInt(m, 10) - 1;
  return `${labels[idx] ?? m} ${year.slice(2)}`;
}
export default function UserGrowthChart() {
  const [data, setData] = useState<UserGrowthPoint[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUserGrowth()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <div className="h-64 rounded-xl bg-navy/5 animate-pulse" />;
  }
  if (data.length === 0) {
    return null;
  }
  const chartData = data.map((d) => ({ label: formatMonth(d.month), total: d.totalUsers }));
  return (
    <div className="rounded-xl border border-navy/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4 text-navy">
        <TrendingUp size={18} />
        <p className="text-sm font-semibold">Évolution des utilisateurs</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#0f172a10" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#0f172a80' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#0f172a80' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #0f172a15', fontSize: 12 }}
            labelStyle={{ fontWeight: 600, color: '#0f172a' }}
          />
          <Area type="monotone" dataKey="total" name="Utilisateurs" stroke="#0f766e" strokeWidth={2} fill="url(#userGrowthGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}