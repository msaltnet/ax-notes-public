import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const output = (path: string) => join(process.cwd(), 'docs', path);
const html = (path: string) => readFileSync(output(path), 'utf8');
const base = (process.env.BASE_PATH ?? '/').replace(/\/+$/, '');
const publicPath = (path: string) => `${base}${path}`;
const siteRoot = new URL(`${base}/`, process.env.SITE_URL ?? 'https://ax.msalt.net').href;

describe('built public site', () => {
  it('serves every local link and asset from the configured mount point', () => {
    const pages = readdirSync(output(''), { recursive: true })
      .filter((path): path is string => typeof path === 'string' && path.endsWith('.html'));
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      const links = html(page).matchAll(/(?:href|src)="(\/[^"\s]*)"/g);
      for (const [, link] of links) {
        if (link.startsWith('//')) continue;
        expect(link.startsWith(`${base}/`), `${page}: ${link}`).toBe(true);
        const path = decodeURIComponent(link.split(/[?#]/)[0].slice(base.length));
        const target = path.endsWith('/') ? `${path}index.html` : path;
        expect(existsSync(output(target.replace(/^\//, ''))), `${page}: ${link}`).toBe(true);
      }
    }
  });

  it('publishes canonical and preview URLs for the configured domain', () => {
    const home = html('index.html');
    expect(home).toContain(`<link rel="canonical" href="${siteRoot}">`);
    expect(home).toContain(`property="og:image" content="${new URL('og.png', siteRoot).href}"`);
    expect(html('sitemap-0.xml')).toContain(`<loc>${siteRoot}</loc>`);
  });

  it('publishes both sample notes with stable routes and navigation', () => {
    const home = html('index.html');
    expect(home).toContain('AX Notes');
    expect(home).toContain(publicPath('/notes/first-agent/'));
    expect(home).toContain(publicPath('/notes/better-prompts/'));
    expect(html('notes/first-agent/index.html')).toContain('첫 번째 Agent를 만들며');
  });

  it('builds tag, series, search and RSS output', () => {
    expect(existsSync(output('tags/agent/index.html'))).toBe(true);
    expect(existsSync(output('series/field-notes/index.html'))).toBe(true);
    expect(existsSync(output('pagefind/pagefind.js'))).toBe(true);
    expect(existsSync(output('.nojekyll'))).toBe(true);
    expect(html('rss.xml')).toContain('first-agent');
    expect(html('rss.xml')).toContain(`<link>${siteRoot}</link>`);
  });

  it('indexes article titles and offers public share links', () => {
    const article = html('notes/first-agent/index.html');
    expect(article).toMatch(/<h1 data-pagefind-body>/);
    expect(article).toContain('twitter.com/intent/tweet');
    expect(article).toContain('threads.com/intent/post');
  });

  it('includes a share preview image', () => {
    expect(existsSync(output('og.png'))).toBe(true);
    expect(html('index.html')).toContain('property="og:image"');
  });

  it('preserves the custom domain when rebuilding the Pages output', () => {
    expect(html('CNAME').trim()).toBe('ax.msalt.net');
  });

  it('keeps article images within the Pages base path', () => {
    const article = html('notes/first-agent/index.html');
    const image = article.match(/src="([^"]*\/_astro\/diagram\.[^"]+\.(?:png|webp))"/);
    expect(image).not.toBeNull();
    expect(image![1]).toContain(publicPath('/_astro/'));
    expect(existsSync(output(image![1].slice(base.length).replace(/^\//, '')))).toBe(true);
  });

  it('loads search code without an undefined Vite preload helper', () => {
    const search = html('search/index.html');
    expect(search).toContain(`src="${publicPath('/search.js')}"`);
    expect(search).not.toContain('__VITE_PRELOAD__');
    expect(existsSync(output('search.js'))).toBe(true);
  });
});
