export type LangCode = 'fr' | 'en' | 'ar';

export interface NavLink {
  labelKey: string;
  path: string;
}

export interface NavGroup {
  labelKey: string;
  children: NavLink[];
}
