import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const i18n = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/assets/i18n' }),
});

const extras_en = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/assets/extras/en' }),
});

const extras_es = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/assets/extras/es' }),
});

const portfolio_en = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/assets/portfolio/en' }),
});

const portfolio_es = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/assets/portfolio/es' }),
});

const posts_en = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/assets/posts/en' }),
});

const posts_es = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/assets/posts/es' }),
});

export const collections = { i18n, extras_en, extras_es, portfolio_en, portfolio_es, posts_en, posts_es };