import { useEffect, useState, useRef } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { BRAND } from '../../config/brand';
import type { LangCode } from '../../types/nav';
const SPACE_LINKS = [
  { key: 'spaces_technicien', path: '/espace/technicien' },
  { key: 'spaces_entreprise', path: '/espace/entreprise' },
  { key: 'spaces_stagiaire', path: '/espace/stagiaire' },
  { key: 'spaces_beneficiel', path: '/espace/beneficiel' },
];
const NAV_LINKS = [
  { key: 'formation', path: '/centre-formation' },
  { key: 'juridique', path: '/juridique' },
  { key: 'reclamation', path: '/reclamation' },
  { key: 'evenements', path: '/evenements' },
];
const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'عربي' },
];
export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isSpacesOpen, setIsSpacesOpen] = useState(false);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();
  const spacesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (spacesRef.current && !spacesRef.current.contains(e.target as Node)) {
        setIsSpacesOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-base font-medium transition-colors hover:text-gold ${isActive ? 'text-gold' : 'text-navy'}`;
  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-white/25 backdrop-blur-sm">
      <nav className="w-full pe-4 py-3 flex items-center justify-between text-white">
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMobileMenu}>
          <img
            src={BRAND.logoSrc}
            alt={BRAND.nameAr}
            className="h-36 w-36 object-contain shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden text-lg font-black tracking-tight text-navy">CTTEERA</span>
          <div className="hidden sm:block max-w-[340px]">
            <p dir="rtl" className="text-[13px] font-bold text-navy leading-[1.4]">
              {BRAND.nameAr}
            </p>
            <p className="mt-1 text-[9px] font-medium text-navy/70 uppercase tracking-wide leading-snug">
              {BRAND.nameFr}
            </p>
          </div>
        </Link>
        <div className="hidden lg:flex items-center gap-8">
          <RouterNavLink to="/" className={linkClass} end>
            {t('nav.home')}
          </RouterNavLink>
          <div className="relative" ref={spacesRef}>
            <button
              onClick={() => setIsSpacesOpen((v) => !v)}
              className="flex items-center gap-1 text-base font-medium text-navy hover:text-gold transition-colors"
            >
              {t('nav.spaces')}
              <ChevronDown size={14} className={`transition-transform ${isSpacesOpen ? 'rotate-180' : ''}`} />
            </button>
            {isSpacesOpen && (
              <div className="absolute top-full mt-2 start-0 w-56 rounded-lg bg-white text-navy shadow-xl overflow-hidden py-1 border border-navy/10">
                {SPACE_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsSpacesOpen(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-navy/5 hover:text-teal transition-colors"
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {NAV_LINKS.map((link) => (
            <RouterNavLink key={link.path} to={link.path} className={linkClass}>
              {t(`nav.${link.key}`)}
            </RouterNavLink>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm font-medium text-navy border-e border-navy/20 pe-4">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  i18n.language === lang.code ? 'text-gold font-semibold' : 'hover:text-gold'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <Link
            to="/register"
            className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors"
          >
            {t('nav.register')}
          </Link>
        </div>
        <button
          className="lg:hidden p-2 text-navy"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-4 py-4 flex flex-col gap-1 text-white">
          <RouterNavLink to="/" className={linkClass} end onClick={closeMobileMenu}>
            <div className="py-2.5">{t('nav.home')}</div>
          </RouterNavLink>
          <div className="py-2.5 text-xs uppercase tracking-wide text-white/50">{t('nav.spaces')}</div>
          {SPACE_LINKS.map((link) => (
            <Link key={link.path} to={link.path} onClick={closeMobileMenu} className="py-2.5 ps-3 text-sm hover:text-gold">
              {t(`nav.${link.key}`)}
            </Link>
          ))}
          {NAV_LINKS.map((link) => (
            <RouterNavLink key={link.path} to={link.path} className={linkClass} onClick={closeMobileMenu}>
              <div className="py-2.5">{t(`nav.${link.key}`)}</div>
            </RouterNavLink>
          ))}
          <div className="flex items-center gap-1 py-2.5 text-sm">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`px-1.5 py-0.5 rounded ${i18n.language === lang.code ? 'text-gold font-semibold' : ''}`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <Link
            to="/register"
            onClick={closeMobileMenu}
            className="mt-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy-dark text-center"
          >
            {t('nav.register')}
          </Link>
        </div>
      )}
    </header>
  );
}
