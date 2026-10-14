import { defineConfig, passthroughImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  site: 'https://hipnosis183.github.io',
  devToolbar: {
    enabled: false
  },
  integrations: [mdx()],
  markdown: {
    processor: satteri({ features: { smartPunctuation: false } }),
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
  image: {
    service: passthroughImageService(),
  },
  redirects: {
    '/blog/bringing-back-to-modern-life-tonic-trouble/': '/blog/tonic-trouble/',
    '/blog/an-overlook-on-jvs-io-emulation-and-implementation/': '/blog/jvs-emulation/',
    '/blog/the-art-of-cracks-and-keygens-nicolausi/': '/blog/nicolausi/',
    '/blog/reversing-and-cracking-the-chinese-android-based-laptop-arcade-games/': '/blog/the-laptop-arcade/',
    '/blog/recreating-a-server-for-a-dead-online-single-player-game-jewelry-master/': '/blog/jewelry-master/',
    '/blog/the-fool-and-his-money-making-a-keygen-for-a-commercial-shockwave-game/': '/blog/the-fool-and-his-money/',
    '/blog/reviving-a-classic-korean-online-puzzle-videogame-twinhexa-arcade/': '/blog/twinhexa-arcade/',
  },
});