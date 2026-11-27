import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { redirectMap, redirectHtml, rssNotice } from '../src/redirects.mjs';

const out = new URL('../docs/', import.meta.url).pathname;
rmSync(out, { recursive: true, force: true });
const write = (rel, body) => { const p = join(out, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, body); };
for (const [rel, url] of redirectMap()) write(rel, redirectHtml(url));
write('rss.xml', rssNotice());
write('robots.txt', 'User-agent: *\nAllow: /\n');
write('.nojekyll', '');
console.log(`built ${redirectMap().size} redirect pages`);
