import { useEffect, useState, useRef } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, User as UserIcon } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { BRAND } from '../../config/brand';
import type { LangCode } from '../../types/nav';
import { getUpcomingEvents } from '../../services/eventService';
import { getTrainingCenters } from '../../services/trainingCenterService';
import { juridiqueService } from '../../services/juridiqueService';
import { getMyReclamations } from '../../services/reclamationService';
const SPACE_LINKS = [
  { key: 'spaces_entreprise', path: '/espace/entreprise' },
  { key: 'spaces_stagiaire', path: '/espace/stagiaire' },
  { key: 'spaces_beneficiel', path: '/espace/beneficiel' },
];
const NAV_LINKS = [
  { key: 'formation', path: '/centre-formation', icon: '/icons/formations.png' },
  { key: 'juridique', path: '/juridique', icon: '/icons/juridique.png' },
  { key: 'reclamation', path: '/reclamation', icon: '/icons/reclamations.png' },
  { key: 'evenements', path: '/evenements', icon: '/icons/evenements.png' },
];
const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'عربي' },
];
function NavBadge({ count }: { count: number }) {
  if (!count || count <= 0) return null;
  return (
    <span className="absolute -top-1.5 -end-2 min-w-[16px] h-[16px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold leading-[16px] text-center">
      {count > 99 ? '99+' : count}
    </span>
  );
}
export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isSpacesOpen, setIsSpacesOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const spacesRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const [eventsCount, setEventsCount] = useState(0);
  const [reclamationsCount, setReclamationsCount] = useState(0);
  const [formationCount, setFormationCount] = useState(0);
  const [juridiqueCount, setJuridiqueCount] = useState(0);
  const isAdmin = isAuthenticated && user?.role === 'ADMIN';
  useEffect(() => {
    getTrainingCenters(0, 1)
      .then((res) => setFormationCount(res.totalElements))
      .catch(() => setFormationCount(0));
    juridiqueService
      .getActive()
      .then((sections) => setJuridiqueCount(sections.length))
      .catch(() => setJuridiqueCount(0));
  }, []);
  useEffect(() => {
    getUpcomingEvents(0, 1)
      .then((res) => setEventsCount(res.totalElements))
      .catch(() => setEventsCount(0));
  }, []);
  useEffect(() => {
    if (!isAuthenticated) {
      setReclamationsCount(0);
      return;
    }
    getMyReclamations(0, 100)
      .then((res) => {
        const pending = res.content.filter((r) => r.status === 'OUVERTE' || r.status === 'EN_COURS').length;
        setReclamationsCount(pending);
      })
      .catch(() => setReclamationsCount(0));
  }, [isAuthenticated]);
  const badgeForKey: Record<string, number> = {
    evenements: eventsCount,
    reclamation: reclamationsCount,
    formation: formationCount,
    juridique: juridiqueCount,
  };
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (spacesRef.current && !spacesRef.current.contains(e.target as Node)) {
        setIsSpacesOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex items-center gap-1.5 whitespace-nowrap text-base font-medium transition-colors hover:text-gold ${isActive ? 'text-gold' : 'text-black'}`;
  const userInitial = (user?.email ?? '?').charAt(0).toUpperCase();
  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-white/25 backdrop-blur-sm">
      <nav className="w-full pe-4 py-3 flex flex-wrap items-center justify-between gap-y-3 text-white">
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={closeMobileMenu}>
          <img
            src={BRAND.logoSrc}
            alt={BRAND.nameAr}
            className="h-24 w-24 object-contain shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden text-lg font-black tracking-tight text-navy">CTTEERA</span>
          <div className="hidden sm:block max-w-[340px]">
            <p dir="rtl" className="text-[11px] font-bold text-navy leading-[1.3]">
              {BRAND.nameAr}
            </p>
            <p className="mt-1 text-[7px] font-medium text-navy/70 uppercase tracking-wide leading-snug">
              {BRAND.nameFr}
            </p>
          </div>
        </Link>
        <div className="hidden lg:flex flex-wrap items-center gap-x-8 gap-y-3 min-w-0">
          <RouterNavLink to="/" className={linkClass} end>
            <img src="/icons/accueil.png" alt="" className="h-4 w-4 object-contain" />
            {t('nav.home')}
          </RouterNavLink>
          <div className="relative shrink-0" ref={spacesRef}>
            <button
              onClick={() => setIsSpacesOpen((v) => !v)}
              className="flex items-center gap-1.5 whitespace-nowrap text-base font-medium text-black hover:text-gold transition-colors"
            >
              <ChevronDown size={14} className={`transition-transform ${isSpacesOpen ? 'rotate-180' : ''}`} />
              <img src="/icons/espace.png" alt="" className="h-4 w-4 object-contain" />
              {t('nav.spaces')}
            </button>
            {isSpacesOpen && (
              <div className="absolute top-full mt-3 start-4 z-20">
                <div className="absolute -top-1.5 start-3 h-3 w-3 rotate-45 bg-white border-t border-s border-navy/10 z-10" />
                <div className="relative w-56 rounded-lg bg-white text-navy shadow-xl overflow-hidden py-1 border border-navy/10">
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
              </div>
            )}
          </div>
          {NAV_LINKS.map((link) => (
            <RouterNavLink key={link.path} to={link.path} className={linkClass}>
              <span className="relative inline-block h-4 w-4 shrink-0">
                <img src={link.icon} alt="" className="h-4 w-4 object-contain" />
                <NavBadge count={badgeForKey[link.key] ?? 0} />
              </span>
              {t(`nav.${link.key}`)}
            </RouterNavLink>
          ))}
          {isAdmin && (
            <RouterNavLink to="/admin" className={linkClass}>
              <img src="/icons/dashboard.png" alt="" className="h-4 w-4 object-contain" />
              Dashboard
            </RouterNavLink>
          )}
        </div>
        <div className="hidden lg:flex flex-wrap items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-sm font-medium text-navy border-e border-navy/20 pe-4 shrink-0 whitespace-nowrap">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`shrink-0 px-1.5 py-0.5 rounded transition-colors ${
                  i18n.language === lang.code ? 'text-gold font-semibold' : 'hover:text-gold'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          {isAuthenticated ? (
            <div className="relative shrink-0" ref={accountRef}>
              <button
                onClick={() => setIsAccountOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full bg-white/70 hover:bg-white pe-3 ps-1.5 py-1.5 transition-colors"
              >
                <span className="h-7 w-7 rounded-full bg-navy text-white text-xs font-bold grid place-items-center">
                  {userInitial}
                </span>
                <span className="text-sm font-medium text-navy max-w-[120px] truncate">
                  {user?.email ?? 'Mon compte'}
                </span>
                <ChevronDown size={14} className={`text-navy transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAccountOpen && (
                <div className="absolute top-full mt-3 end-0 z-20">
                  <div className="absolute -top-1.5 end-4 h-3 w-3 rotate-45 bg-white border-t border-s border-navy/10 z-10" />
                  <div className="relative w-52 rounded-lg bg-white text-navy shadow-xl overflow-hidden py-1 border border-navy/10">
                    <Link
                      to="/profil"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-navy/5 hover:text-teal transition-colors"
                    >
                      <UserIcon size={15} />
                      Mon profil
                    </Link>
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        logout?.();
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-navy/5 hover:text-red-600 transition-colors"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/register"
              className="shrink-0 whitespace-nowrap rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy-dark hover:bg-gold-light transition-colors"
            >
              {t('nav.register')}
            </Link>
          )}
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
            <div className="py-2.5 flex items-center gap-1.5">
              <img src="/icons/accueil.png" alt="" className="h-4 w-4 object-contain" />
              {t('nav.home')}
            </div>
          </RouterNavLink>
          {isAuthenticated && (
            <Link to="/profil" onClick={closeMobileMenu} className="py-2.5 flex items-center gap-1.5 text-sm hover:text-gold">
              <UserIcon size={16} />
              Mon profil
            </Link>
          )}
          <div className="py-2.5 text-xs uppercase tracking-wide text-white/50">{t('nav.spaces')}</div>
          {SPACE_LINKS.map((link) => (
            <Link key={link.path} to={link.path} onClick={closeMobileMenu} className="py-2.5 ps-3 text-sm hover:text-gold">
              {t(`nav.${link.key}`)}
            </Link>
          ))}
          {NAV_LINKS.map((link) => (
            <RouterNavLink key={link.path} to={link.path} className={linkClass} onClick={closeMobileMenu}>
              <div className="py-2.5 flex items-center gap-1.5">
                <span className="relative inline-block h-4 w-4 shrink-0">
                  <img src={link.icon} alt="" className="h-4 w-4 object-contain" />
                  <NavBadge count={badgeForKey[link.key] ?? 0} />
                </span>
                {t(`nav.${link.key}`)}
              </div>
            </RouterNavLink>
          ))}
          {isAdmin && (
            <RouterNavLink to="/admin" className={linkClass} onClick={closeMobileMenu}>
              <div className="py-2.5 flex items-center gap-1.5">
                <img src="/icons/dashboard.png" alt="" className="h-4 w-4 object-contain" />
                Dashboard
              </div>
            </RouterNavLink>
          )}
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
          {isAuthenticated ? (
            <button
              onClick={() => {
                closeMobileMenu();
                logout?.();
              }}
              className="mt-2 rounded-full bg-navy/10 px-5 py-2.5 text-sm font-semibold text-red-600 text-center"
            >
              Se déconnecter
            </button>
          ) : (
            <Link
              to="/register"
              onClick={closeMobileMenu}
              className="mt-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy-dark text-center"
            >
              {t('nav.register')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}