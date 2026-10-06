import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeSanitize from 'rehype-sanitize';
import rehypeTables from './src/lib/rehype-tables.mjs';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://dev-team-404.github.io',
  base: process.env.BASE_PATH ?? '/ax-notes-public',
  outDir: './docs',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: { processor: unified({ rehypePlugins: [rehypeSanitize, rehypeTables] }) },
});
