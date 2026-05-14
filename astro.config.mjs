import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

/**
 * GitHub Pages URLs (production build via Actions):
 * Set repository Variables in GitHub → Settings → Secrets and variables → Actions → Variables
 * - PAGES_SITE_URL  Example: https://USERNAME.github.io
 * - PAGES_BASE_PATH Use "/" for USERNAME.github.io root repo only; otherwise "/portfolio" (same as repo name)
 */
let siteUrl = process.env.PAGES_SITE_URL?.trim() || 'https://csesztii.github.io';
if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
  siteUrl = 'https://' + siteUrl;
}

const rawBase =
  process.env.PAGES_BASE_PATH?.trim()?.length ? process.env.PAGES_BASE_PATH.trim() : '/portfolio';

export default defineConfig({
  site: siteUrl,
  /** @type {string} */
  base: rawBase === '/' ? '/' : rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase,

  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => !page.includes('/applications'),
    }),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hu', 'de'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  output: 'static',

  image: {
    remotePatterns: [],
  },
});

