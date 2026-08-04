import { useTranslation } from 'react-i18next';
import { UserRound, MapPin, BadgeCheck } from 'lucide-react';

// ⚠️ Données placeholder — à remplacer par un appel GET /api/techniciens?size=4 (TASK-F004).
const FEATURED_TECHNICIENS = [
  { name: 'Ahmed B.', specialty: 'Électricité', city: 'Tunis' },
  { name: 'Sonia K.', specialty: 'Réseaux', city: 'Sfax' },
  { name: 'Mehdi T.', specialty: 'CCTV', city: 'Sousse' },
  { name: 'Nour A.', specialty: 'Climatisation', city: 'Bizerte' },
];

export default function FeaturedTechniciensSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-navy/[0.03] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl font-black text-navy text-center mb-12">
          {t('home.featured_title')}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_TECHNICIENS.map((tech) => (
            <div key={tech.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-16 h-16 rounded-full bg-navy/10 grid place-items-center mb-4">
                <UserRound size={28} className="text-navy/50" />
                <span className="absolute -bottom-1 -end-1 grid place-items-center h-5 w-5 rounded-full bg-teal text-white">
                  <BadgeCheck size={13} />
                </span>
              </div>
              <h3 className="font-bold text-navy">{tech.name}</h3>
              <span className="inline-block mt-1.5 text-xs font-semibold text-teal bg-teal/10 rounded-full px-2.5 py-1">
                {tech.specialty}
              </span>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-navy/50">
                <MapPin size={13} />
                {tech.city}
              </p>
              <button className="mt-4 text-sm font-semibold text-gold hover:text-gold-light transition-colors">
                {t('home.featured_cta')} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
