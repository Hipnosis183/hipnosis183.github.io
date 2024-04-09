import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://hipnosis183.github.io',
  integrations: [mdx()],
  markdown: {
    smartypants: false,
    syntaxHighlight: 'prism',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    fallback: {
      es: 'en',
    },
    routing: {
      prefixDefaultLocale: false,
    },
  },
});