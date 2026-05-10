# Astro — Framework Setup Reference

> Everything a developer or AI agent needs to initialise and configure the project.
> Design-agnostic: Astro imposes no visual opinions — all CSS and markup is yours.

---

## 1. Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18.17.1 or 20.3.0+ (LTS recommended) |
| npm | 9+ (bundled with Node) |
| Git | any recent version |

---

## 2. Project Initialisation

```bash
# Create project (choose: TypeScript strict, no starter template)
npm create astro@latest portfolio -- --template minimal --typescript strict

cd portfolio

# Install integrations
npm install @astrojs/tailwind @astrojs/sitemap @astrojs/check
npm install tailwindcss
```

---

## 3. `astro.config.mjs` — Full Configuration

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Replace with your actual GitHub Pages URL
  site: 'https://<your-github-username>.github.io',

  // If repo name is NOT the user root repo, add the base path:
  // base: '/portfolio',

  integrations: [
    tailwind({ applyBaseStyles: false }),  // we control base styles ourselves
    sitemap({
      filter: (page) => !page.includes('/applications'),  // exclude tracker from sitemap
    }),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'hu', 'de'],
    routing: {
      prefixDefaultLocale: true,  // forces /en/ so all locales are symmetric
    },
  },

  // Output static HTML — required for GitHub Pages
  output: 'static',

  // Image optimisation (built-in)
  image: {
    remotePatterns: [],  // no remote images needed for a static portfolio
  },
});
```

---

## 4. `tailwind.config.mjs`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
  darkMode: 'class',  // toggled by adding class="dark" on <html>
  theme: {
    extend: {
      // Design tokens are mapped here from src/styles/tokens.css
      // Example — replace with your actual Figma token values:
      colors: {
        brand: 'var(--color-brand)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      spacing: {
        // Add any custom spacing tokens from your design
      },
    },
  },
  plugins: [],
};
```

---

## 5. `src/styles/tokens.css` — Design Token File

This file is the single source of truth for your Figma design tokens.
All agents read this file; they do not hard-code colours or sizes.

```css
/* src/styles/tokens.css */
/* Export these values from Figma and paste here before any agent begins work */

:root {
  /* Colors */
  --color-brand:      #000000;   /* replace */
  --color-surface:    #ffffff;   /* replace */
  --color-text:       #1a1a1a;   /* replace */
  --color-muted:      #6b7280;   /* replace */
  --color-accent:     #000000;   /* replace */

  /* Typography */
  --font-display:     'YourDisplayFont', serif;
  --font-body:        'YourBodyFont', sans-serif;
  --font-size-base:   1rem;
  --line-height-base: 1.6;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --space-16: 4rem;

  /* Borders */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,.1);
  --shadow-md: 0 4px 16px rgba(0,0,0,.12);
}

/* Dark mode overrides */
:root.dark {
  --color-surface:  #0f0f0f;
  --color-text:     #f5f5f5;
  --color-muted:    #9ca3af;
}
```

---

## 6. `src/styles/global.css` — Global Stylesheet

```css
/* src/styles/global.css */
@import './tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Reset & base */
*, *::before, *::after { box-sizing: border-box; }

html {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text);
  background-color: var(--color-surface);
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Focus ring — uses brand color, not browser default */
:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 3px;
}
```

---

## 7. Directory Structure

```
src/
├── components/          # .astro files only (no framework components unless needed)
├── layouts/
│   ├── Base.astro       # <html>, <head>, global scripts
│   └── Page.astro       # wraps Base, adds Nav + Footer
├── pages/
│   ├── en/
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   └── applications.astro
│   ├── hu/
│   │   └── index.astro  # (mirrors en/ structure)
│   ├── de/
│   │   └── index.astro  # (mirrors en/ structure)
│   └── 404.astro
├── content/
│   ├── config.ts        # Content Collection schemas
│   ├── projects/        # .md or .json files, one per project
│   └── experience/      # .md or .json files, one per job
├── i18n/
│   ├── en.json
│   ├── hu.json
│   ├── de.json
│   └── utils.ts         # t() helper function
└── styles/
    ├── tokens.css
    └── global.css
```

---

## 8. Content Collections — `src/content/config.ts`

```ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    tech:        z.array(z.string()),
    url:         z.string().url().optional(),
    repo:        z.string().url().optional(),
    image:       z.string(),          // path relative to public/
    featured:    z.boolean().default(false),
    order:       z.number().optional(),
  }),
});

const experience = defineCollection({
  type: 'data',
  schema: z.object({
    company:     z.string(),
    role:        z.string(),
    start:       z.string(),          // ISO date string "YYYY-MM"
    end:         z.string().optional(), // omit if current role
    description: z.string(),
    tech:        z.array(z.string()),
    linkedinUrl: z.string().url().optional(),
  }),
});

const applications = defineCollection({
  type: 'data',
  schema: z.object({
    company:   z.string(),
    role:      z.string(),
    status:    z.enum(['applied', 'interview', 'offer', 'rejected', 'withdrawn']),
    appliedAt: z.string(),            // ISO date string "YYYY-MM-DD"
    link:      z.string().url().optional(),
    notes:     z.string().optional(),
  }),
});

export const collections = { projects, experience, applications };
```

---

## 9. i18n Utility — `src/i18n/utils.ts`

```ts
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
```

**Usage in any `.astro` file:**
```astro
---
import { t, getLocaleFromUrl } from '../i18n/utils';
const locale = getLocaleFromUrl(Astro.url);
---
<h1>{t('hero.title', locale)}</h1>
```

---

## 10. `Base.astro` Layout — Required Head Tags

```astro
---
// src/layouts/Base.astro
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  locale: string;
  canonical: string;
}
const { title, description, locale, canonical } = Astro.props;
---
<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    <!-- hreflang: agent fills these per page -->
    <link rel="alternate" hreflang="en" href={`https://<your-site>/en${Astro.url.pathname.replace(/^\/(en|hu|de)/, '')}`} />
    <link rel="alternate" hreflang="hu" href={`https://<your-site>/hu${Astro.url.pathname.replace(/^\/(en|hu|de)/, '')}`} />
    <link rel="alternate" hreflang="de" href={`https://<your-site>/de${Astro.url.pathname.replace(/^\/(en|hu|de)/, '')}`} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:locale" content={locale} />
    <meta property="og:type" content="website" />

    <!-- JSON-LD Person schema -->
    <script type="application/ld+json" set:html={JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Your Name",
      "url": "https://<your-site>/en",
      "sameAs": ["https://linkedin.com/in/yourprofile", "https://github.com/yourusername"]
    })} />

    <title>{title}</title>
  </head>
  <body>
    <a href="#main-content" class="sr-only focus:not-sr-only">Skip to content</a>
    <slot />
  </body>
</html>
```

---

## 11. GitHub Actions — Deploy Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run astro check   # TypeScript errors
      - run: npm run build         # Build must succeed
```

**Required:** In GitHub → repository Settings → Pages → set Source to **GitHub Actions**.

---

## 12. `package.json` Scripts

```json
{
  "scripts": {
    "dev":     "astro dev",
    "build":   "astro build",
    "preview": "astro preview",
    "astro":   "astro",
    "check":   "astro check"
  },
  "engines": {
    "node": ">=18.17.1"
  }
}
```

---

## 13. `public/robots.txt`

```
User-agent: *
Allow: /

# Exclude the private applications tracker from all crawlers
Disallow: /en/applications
Disallow: /hu/applications
Disallow: /de/applications

Sitemap: https://<your-site>/sitemap-index.xml
```

---

## 14. JavaScript Islands — When and How

Astro ships zero JS by default. Use islands **only** when interactivity is required.

```astro
<!-- Hamburger nav — loads JS only on the client -->
<NavMobile client:load />

<!-- Dark mode toggle — waits until idle -->
<DarkModeToggle client:idle />

<!-- Heavy animation component — waits until visible in viewport -->
<HeroAnimation client:visible />
```

**Directive guide:**
| Directive | When to use |
|---|---|
| `client:load` | Immediately on page load (nav, critical UI) |
| `client:idle` | Non-critical UI after load (toggles, secondary widgets) |
| `client:visible` | When the component scrolls into view (animations, heavy components) |
| `client:only="..."` | Components that cannot render server-side |

For plain JS without a framework (hamburger toggle, scroll effects, custom cursor):
use a `<script>` tag directly inside the `.astro` file — Astro bundles and deduplicates it automatically.

---

## 15. Image Handling

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<!-- Optimised, lazy-loaded, correct dimensions -->
<Image
  src={heroImage}
  alt="Descriptive alt text"
  width={1200}
  height={800}
  loading="lazy"
  format="webp"
/>

<!-- LCP image: eager load so it's not delayed -->
<Image src={heroImage} alt="..." loading="eager" fetchpriority="high" />
```

Place source images in `src/assets/` (processed by Astro) or `public/` (served as-is, no optimisation).

---

## 16. Minimal Agent Checklist Before Starting Any Task

Before writing code, every agent must:

1. Read `src/styles/tokens.css` — never hard-code a colour or font
2. Read `src/i18n/en.json` — add any new UI strings here before using `t()`
3. Check existing components in `src/components/` — extend rather than duplicate
4. Run `npm run astro check` before committing — zero TypeScript errors required
5. Run `npm run build` locally before committing — build must succeed

---

## Quick Reference

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server at `localhost:4321` with hot reload |
| `npm run build` | Build static site into `dist/` |
| `npm run preview` | Serve `dist/` locally to verify the build |
| `npm run check` | TypeScript + Astro type check |
| `astro add <integration>` | Add an official integration |
