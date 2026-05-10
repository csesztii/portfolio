import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Replace with your actual GitHub Pages URL
  site: 'https://<your-github-username>.github.io',

  // If repo name is NOT the user root repo, add the base path:
  // base: '/portfolio',

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

