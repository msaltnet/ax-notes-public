import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = (path: string) => join(process.cwd(), 'dist', path);
const html = (path: string) => readFileSync(dist(path), 'utf8');
const base = (process.env.BASE_PATH ?? '/ax-notes-public').replace(/\/+$/, '');
const publicPath = (path: string) => `${base}${path}`;
const siteRoot = new URL(`${base}/`, process.env.SITE_URL ?? 'https://dev-team-404.github.io').href;

describe('built public site', () => {
  it('publishes both sample notes with stable routes and navigation', () => {
    const home = html('index.html');
    expect(home).toContain('AX Notes');
    expect(home).toContain(publicPath('/notes/first-agent/'));
    expect(home).toContain(publicPath('/notes/better-prompts/'));
    expect(html('notes/first-agent/index.html')).toContain('첫 번째 Agent를 만들며');
  });

  it('builds tag, series, search and RSS output', () => {
    expect(existsSync(dist('tags/agent/index.html'))).toBe(true);
    expect(existsSync(dist('series/field-notes/index.html'))).toBe(true);
    expect(existsSync(dist('pagefind/pagefind.js'))).toBe(true);
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
    expect(existsSync(dist('og.png'))).toBe(true);
    expect(html('index.html')).toContain('property="og:image"');
  });

  it('keeps article images within the Pages base path', () => {
    const article = html('notes/first-agent/index.html');
    const image = article.match(/src="([^"]*\/_astro\/diagram\.[^"]+\.(?:png|webp))"/);
    expect(image).not.toBeNull();
    expect(image![1]).toContain(publicPath('/_astro/'));
    expect(existsSync(dist(image![1].slice(base.length).replace(/^\//, '')))).toBe(true);
  });

  it('loads search code without an undefined Vite preload helper', () => {
    const search = html('search/index.html');
    expect(search).toContain(`src="${publicPath('/search.js')}"`);
    expect(search).not.toContain('__VITE_PRELOAD__');
    expect(existsSync(dist('search.js'))).toBe(true);
  });
});
