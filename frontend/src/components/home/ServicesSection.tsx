import { useTranslation } from 'react-i18next';
import { Users, Building2, GraduationCap, Scale, CalendarDays } from 'lucide-react';

const SERVICES = [
  { icon: Users, key: 'service_technicien', color: 'bg-navy' },
  { icon: Building2, key: 'service_entreprise', color: 'bg-teal' },
  { icon: GraduationCap, key: 'service_formation', color: 'bg-gold' },
  { icon: Scale, key: 'service_juridique', color: 'bg-navy-dark' },
  { icon: CalendarDays, key: 'service_evenements', color: 'bg-teal-light' },
];

export default function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-black text-navy text-center mb-12">
        {t('home.services_title')}
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {SERVICES.map(({ icon: Icon, key, color }) => (
          <div
            key={key}
            className={`${color} rounded-2xl p-6 text-white flex flex-col gap-4 hover:-translate-y-1 transition-transform shadow-sm`}
          >
            <span className="grid place-items-center h-11 w-11 rounded-xl bg-white/15">
              <Icon size={22} />
            </span>
            <div>
              <h3 className="font-bold text-lg leading-snug">{t(`home.${key}`)}</h3>
              <p className="mt-1.5 text-sm text-white/75 leading-relaxed">{t(`home.${key}_desc`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
