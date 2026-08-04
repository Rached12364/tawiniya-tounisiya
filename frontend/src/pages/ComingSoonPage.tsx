import { useTranslation } from 'react-i18next';
import { Construction } from 'lucide-react';

export default function ComingSoonPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-32 flex flex-col items-center text-center">
      <span className="grid place-items-center h-16 w-16 rounded-2xl bg-navy/5 text-navy/40 mb-6">
        <Construction size={28} />
      </span>
      <h1 className="text-2xl font-black text-navy">{t('coming_soon.title')}</h1>
      <p className="mt-2 text-navy/60 max-w-md">{t('coming_soon.body')}</p>
    </div>
  );
}
