import { MapPin, Mail, Phone, LogIn } from 'lucide-react';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from '../icons/SocialIcons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { LangCode } from '../../types/nav';
const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'عربي' },
];
export default function TopBar() {
  const { t, i18n } = useTranslation();
  return (
    <div className="hidden md:block bg-transparent text-white text-[11px]">
      <div className="mx-auto max-w-7xl px-4 h-8 flex items-center justify-end gap-4">
        <div className="flex items-center gap-1 border-e border-navy/20 pe-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`px-1 py-0.5 rounded transition-colors ${
                i18n.language === lang.code ? 'text-gold font-semibold' : 'hover:text-gold'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-1">
          <MapPin size={11} className="text-gold" />
          {t('topbar.address')}
        </span>
        <a href={`mailto:${t('topbar.email')}`} className="flex items-center gap-1 hover:text-gold transition-colors">
          <Mail size={11} className="text-gold" />
          {t('topbar.email')}
        </a>
        <a href={`tel:${t('topbar.phone')}`} className="flex items-center gap-1 hover:text-gold transition-colors">
          <Phone size={11} className="text-gold" />
          {t('topbar.phone')}
        </a>
        <div className="flex items-center gap-2.5 border-s border-navy/20 ps-3">
          <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors">
            <FacebookIcon width={12} height={12} />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-gold transition-colors">
            <InstagramIcon width={12} height={12} />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-gold transition-colors">
            <LinkedinIcon width={12} height={12} />
          </a>
        </div>
        <Link to="/login" className="flex items-center gap-1 hover:text-gold transition-colors">
          <LogIn size={11} />
          {t('topbar.login')}
        </Link>
      </div>
    </div>
  );
}


