import en from './en.json';
import hu from './hu.json';
import de from './de.json';

const translations = { en, hu, de } as const;
export type Locale = keyof typeof translations;

export function t(key: string, locale: Locale): string {
  const dict = translations[locale] as Record<string, string>;
  return dict[key] ?? translations['en'][key as keyof typeof en] ?? key;
}

export function pathnameWithoutConfiguredBase(pathname: string): string {
  let basePrefix = import.meta.env.BASE_URL;
  if (!basePrefix || basePrefix === '/') return pathname;

  if (!basePrefix.startsWith('/')) basePrefix = `/${basePrefix}`;
  const trimmed = basePrefix.endsWith('/') ? basePrefix.slice(0, -1) : basePrefix;

  if (pathname === trimmed) return '/';
  if (pathname.startsWith(`${trimmed}/`)) return pathname.slice(trimmed.length) || '/';

  return pathname;
}

/** Public `/public` file URLs with correct GitHub Pages `base`. */
export function publicAsset(subpath: string): string {
  const clean = subpath.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${clean}`;
}

export function getLocaleFromUrl(url: URL): Locale {
  const pathname = pathnameWithoutConfiguredBase(url.pathname);
  const parts = pathname.split('/').filter(Boolean);
  const first = parts[0];
  if (first && first in translations) return first as Locale;
  return 'en';
}

export function localePath(path: string, locale: Locale): string {
  const inner =
    path === '/' || path === ''
      ? `/${locale}/`
      : `/${locale}${path.startsWith('/') ? path : `/${path}`}`;
  const baseRoot = import.meta.env.BASE_URL;
  const normalizedInner = inner.replace(/\/+/g, '/');

  if (!baseRoot || baseRoot === '/') return normalizedInner;
  const root = baseRoot.endsWith('/') ? baseRoot.slice(0, -1) : baseRoot;

  return `${root}${normalizedInner}`.replace(/\/+/g, '/');
}

/** Same path as `url` but with locale segment switched (for `hreflang`). */
export function alternatePathname(url: URL, target: Locale): string {
  const innerRaw = pathnameWithoutConfiguredBase(url.pathname);
  const hasTrailingSlash = innerRaw.endsWith('/') && innerRaw !== '/';

  const stripped = innerRaw.replace(/\/+$/, '') || '/';
  const segments = stripped.split('/').filter(Boolean); // ['/en/foo']...

  let pathAfterLocale = '/';
  if (segments.length > 1) {
    pathAfterLocale = `/${segments.slice(1).join('/')}`;
    if (hasTrailingSlash) pathAfterLocale = `${pathAfterLocale.replace(/\/+$/, '')}/`;
  }

  return localePath(pathAfterLocale, target);
}

