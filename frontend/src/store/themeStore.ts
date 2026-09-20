import { create } from 'zustand';
const STORAGE_KEY = 'ctteera-theme';
function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function applyTheme(isDark: boolean) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', isDark);
  window.localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
}
interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}
const initialTheme = getInitialTheme();
applyTheme(initialTheme);
export const useThemeStore = create<ThemeState>((set) => ({
  isDark: initialTheme,
  toggleTheme: () =>
    set((state) => {
      const next = !state.isDark;
      applyTheme(next);
      return { isDark: next };
    }),
  setTheme: (isDark: boolean) => {
    applyTheme(isDark);
    set({ isDark });
  },
}));