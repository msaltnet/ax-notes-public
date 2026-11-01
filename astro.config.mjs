import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeSanitize from 'rehype-sanitize';
import rehypeTables from './src/lib/rehype-tables.mjs';
import rehypeExternalLinks from './src/lib/rehype-external-links.mjs';
import appFeed from './src/integrations/app-feed.mjs';

const site = process.env.SITE_URL ?? 'https://msaltnet.github.io';

export default defineConfig({
  site,
  base: process.env.BASE_PATH ?? '/ax-notes-public',
  outDir: './docs',
  trailingSlash: 'always',
  integrations: [sitemap(), appFeed()],
  markdown: { processor: unified({ rehypePlugins: [rehypeSanitize, rehypeTables, [rehypeExternalLinks, { site }]] }) },
});
