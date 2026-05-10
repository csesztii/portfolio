import en from './en.json';
import hu from './hu.json';
import de from './de.json';

const translations = { en, hu, de } as const;
export type Locale = keyof typeof translations;

export function t(key: string, locale: Locale): string {
  const dict = translations[locale] as Record<string, string>;
  return dict[key] ?? translations['en'][key as keyof typeof en] ?? key;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Locale;
  return 'en';
}

export function localePath(path: string, locale: Locale): string {
  return `/${locale}${path.startsWith('/') ? path : '/' + path}`;
}

