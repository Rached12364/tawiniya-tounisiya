# Tawiniya Frontend

Frontend React de la plateforme Tawiniya Tounisiya.

## Stack
- React 19 + Vite + TypeScript
- React Router v6
- Tailwind CSS v4 (config CSS-first via `@theme` dans `src/index.css`)
- React Query (`@tanstack/react-query`)
- Zustand
- i18next (FR / EN / AR avec bascule RTL automatique)
- lucide-react (icônes)

## Démarrage

```bash
npm install
npm run dev
```

→ ouvre sur **http://localhost:3000**

## Build de production

```bash
npm run build
```

## Structure

```
src/
├── pages/          # Pages routées (HomePage, ComingSoonPage, NotFoundPage, ...)
├── components/
│   ├── layout/      # TopBar, Navbar, Footer, Layout
│   ├── home/        # Sections de la page d'accueil
│   └── icons/        # Icônes SVG maison (réseaux sociaux)
├── services/        # Client Axios (services/api.ts)
├── hooks/           # Hooks réutilisables (useCountUp, ...)
├── store/           # Stores Zustand (uiStore, ...)
├── types/           # Types partagés
├── assets/          # Images, logos
└── i18n/            # Config i18next + traductions (fr/en/ar)
```

## Palette (imposée par le brief produit)

| Nom    | Hex       | Variable Tailwind      |
|--------|-----------|-------------------------|
| Navy   | `#1B3A5C` | `bg-navy` / `text-navy` |
| Gold   | `#C9A227` | `bg-gold` / `text-gold` |
| Teal   | `#0D9488` | `bg-teal` / `text-teal` |

Variantes `navy-dark`, `gold-light`, `teal-light` également disponibles.

---

## TASK-F001 — Initialisation projet ✅

- Projet Vite + React + TypeScript créé
- Dépendances installées : React Router v6, Axios, Tailwind v4, React Query, Zustand, i18next (+ react-i18next, i18next-browser-languagedetector)
- Structure de dossiers en place
- Tailwind configuré avec la palette imposée

**Critères d'acceptation** :
- ✅ `npm run dev` démarre sur localhost:3000 (port forcé dans `vite.config.ts`)
- ✅ Tailwind fonctionne (`@tailwindcss/vite`, palette custom via `@theme`)
- ✅ React Router configuré (`src/App.tsx`, `src/main.tsx`)

## TASK-F002 — Navbar + Footer ✅

- **TopBar** (`components/layout/TopBar.tsx`) : adresse, email, tel, sélecteur de langue FR/EN/AR, réseaux sociaux, lien connexion
- **Navbar** (`components/layout/Navbar.tsx`) : logo (wordmark texte — voir note ci-dessous), menu complet avec dropdown "Espaces", transparente en haut → navy au scroll (`isScrolled` + `window.scrollY`), sticky, menu mobile en hamburger
- **Footer** (`components/layout/Footer.tsx`) : 4 colonnes (logo/tagline, liens utiles, services, contact)
- **i18n** : FR/EN/AR opérationnel, bascule `dir="rtl"` automatique sur `<html>` quand `ar` est sélectionné (`src/i18n/config.ts`)

**Critères d'acceptation** :
- ✅ Menu s'affiche correctement (desktop + mobile)
- ✅ Changement de langue fonctionne (boutons FR/EN/عربي dans la TopBar)
- ✅ RTL actif en arabe (attribut `dir` posé dynamiquement sur `<html>`)
- ✅ Navbar sticky au scroll (transparente → navy avec `shadow-lg`)

⚠️ **Note logo** : aucun fichier `logo.png` n'a été fourni, donc le logo est actuellement un **wordmark texte** ("Tawiniya **Tounisiya**"). Pour utiliser un vrai logo : déposez le fichier dans `public/logo.png` et remplacez le `<span>` du logo dans `Navbar.tsx` et `Footer.tsx` par une balise `<img src="/logo.png" ... />`.

## TASK-F003 — Page d'accueil ✅

Sections construites dans `src/components/home/` :
- **HeroSlider** — 3 slides en dégradé navy/gold/teal, rotation auto toutes les 5s, flèches + puces de navigation, pas de dépendance externe
- **AboutSection** — texte en arabe (RTL) + emplacement vidéo YouTube (voir note)
- **SponsorsSection** — bandeau de partenaires (placeholder, voir note)
- **StatsSection** — 4 statistiques avec compteur animé au scroll (`useCountUp`)
- **ServicesSection** — 5 cards colorées (navy / teal / gold / navy-dark / teal-light)
- **FeaturedTechniciensSection** — "Nos techniciens à la une" (données placeholder, voir note)

**Critères d'acceptation** :
- ✅ Slider fonctionne avec auto-rotate (5000ms, `setInterval`)
- ✅ Section sponsors affiche les logos (texte stylisé — voir note)
- ✅ Page responsive mobile (grids `sm:` / `md:` / `lg:` sur toutes les sections)

⚠️ **Notes contenu placeholder** (aucune image/donnée réelle n'a été fournie dans le brief) :
- **Hero slider** : dégradés + typographie plutôt que 3 photos réelles. Pour utiliser de vraies photos, ajoutez-les dans `src/assets/` et remplacez le `bg-gradient-to-br` par une image de fond dans `HeroSlider.tsx`.
- **Vidéo YouTube** : bouton "play" stylisé en attendant l'ID réel. Renseignez `YOUTUBE_VIDEO_ID` dans `AboutSection.tsx`.
- **Sponsors** : 6 noms de partenaires fictifs. À remplacer par les vrais logos des 149 entreprises une fois `TASK-B005`/`TASK-F005` réalisées.
- **Techniciens à la une** : 4 profils fictifs. À connecter à `GET /api/techniciens?size=4` une fois `TASK-F004` réalisée.

## Validation technique effectuée
- ✅ `npx tsc --noEmit` → aucune erreur
- ✅ `npm run build` → build de production réussi
- ✅ `npm run dev` → démarre correctement sur le port 3000

## Prochaine étape
➡ TASK-F004 — Page Techniciens (grid, filtres, pagination, connexion à l'API réelle)
➡ TASK-F005 — Page Entreprises
➡ TASK-F006 — Pages Login + Register (connexion aux endpoints `/api/auth/*` déjà prêts côté backend)
