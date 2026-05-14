import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

/**
 * GitHub Pages URLs (production build via Actions):
 * Set repository Variables in GitHub → Settings → Secrets and variables → Actions → Variables
 * - PAGES_SITE_URL  Example: https://USERNAME.github.io
 * - PAGES_BASE_PATH Use "/" for USERNAME.github.io root repo only; otherwise "/portfolio" (same as repo name)
 */
export default defineConfig({
  site: 'https://csesztii.github.io',
  base: '/portfolio',

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

