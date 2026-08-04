import { useTranslation } from 'react-i18next';

// ⚠️ Logos placeholder — à remplacer par les vrais logos des 149 entreprises partenaires (TASK-B005/F005).
const SPONSORS = ['Alpha Tech', 'Meridien', 'Nova Systems', 'Atlas Group', 'Carthage Elec', 'Delta Pro'];

export default function SponsorsSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-navy/[0.03] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-sm font-semibold tracking-wide text-navy/50 uppercase mb-8">
          {t('home.sponsors_title')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {SPONSORS.map((name) => (
            <span
              key={name}
              className="text-lg font-bold text-navy/30 hover:text-navy/60 transition-colors select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
