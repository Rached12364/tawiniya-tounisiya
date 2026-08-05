import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPublicImages, resolveImageUrl } from '../../services/contentService';
import type { ContentImage } from '../../types/admin';
const FALLBACK_SPONSORS = ['Alpha Tech', 'Meridien', 'Nova Systems', 'Atlas Group', 'Carthage Elec', 'Delta Pro'];
export default function SponsorsSection() {
  const { t } = useTranslation();
  const [images, setImages] = useState<ContentImage[]>([]);
  useEffect(() => {
    getPublicImages('SPONSOR')
      .then((data) => setImages(data.filter((img) => img.active)))
      .catch(() => setImages([]));
  }, []);
  return (
    <section className="bg-navy/[0.03] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-sm font-semibold tracking-wide text-navy/50 uppercase mb-8">
          {t('home.sponsors_title')}
        </p>
        {images.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {images.map((img) => (
              <img
                key={img.id}
                src={resolveImageUrl(img.imagePath)}
                alt={img.title}
                className="h-10 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {FALLBACK_SPONSORS.map((name) => (
              <span
                key={name}
                className="text-lg font-bold text-navy/30 hover:text-navy/60 transition-colors select-none"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

