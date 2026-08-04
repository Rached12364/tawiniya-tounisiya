import { useTranslation } from 'react-i18next';
import { useCountUp } from '../../hooks/useCountUp';

const STATS = [
  { value: 500, suffix: '+', labelKey: 'stats_technicien' },
  { value: 150, suffix: '+', labelKey: 'stats_entreprise' },
  { value: 2400, suffix: '+', labelKey: 'stats_intervention' },
  { value: 24, suffix: '', labelKey: 'stats_gouvernorat' },
];

function StatItem({ value, suffix, labelKey }: { value: number; suffix: string; labelKey: string }) {
  const { t } = useTranslation();
  const { value: animated, ref } = useCountUp(value);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white">
        {animated}
        <span className="text-gold">{suffix}</span>
      </div>
      <p className="mt-2 text-sm text-white/60">{t(`home.${labelKey}`)}</p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-navy py-16">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat) => (
          <StatItem key={stat.labelKey} {...stat} />
        ))}
      </div>
    </section>
  );
}
