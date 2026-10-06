import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = (path: string) => join(process.cwd(), 'docs', path);
const html = (path: string) => readFileSync(dist(path), 'utf8');
const base = (process.env.BASE_PATH ?? '/ax-notes-public').replace(/\/+$/, '');
const publicPath = (path: string) => `${base}${path}`;
const siteRoot = new URL(`${base}/`, process.env.SITE_URL ?? 'https://dev-team-404.github.io').href;

describe('built public site', () => {
  it('makes article tables keyboard-accessible without losing their headers or cells', () => {
    for (const path of ['notes/agent-review-loop/index.html', 'notes/automation-review-time/index.html']) {
      const article = html(path);
      expect(article).toMatch(/<div class="article-table" tabindex="0" role="region" aria-label="본문 표">\s*<table>/);
      expect(article).toMatch(/<thead>[\s\S]*?<th>[\s\S]*?<\/thead>/);
      expect(article).toMatch(/<tbody>[\s\S]*?<td>[\s\S]*?<\/tbody><\/table><\/div>/);
    }
    expect(html('notes/agent-review-loop/index.html')).toContain('인용한 부분이 요약을 뒷받침하는가');
  });

  it('serves every local link and asset from the configured mount point', () => {
    const pages = readdirSync(dist(''), { recursive: true })
      .filter((path): path is string => typeof path === 'string' && path.endsWith('.html'));
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      const links = html(page).matchAll(/(?:href|src)="(\/[^"\s]*)"/g);
      for (const [, link] of links) {
        if (link.startsWith('//')) continue;
        expect(link.startsWith(`${base}/`), `${page}: ${link}`).toBe(true);
        const path = decodeURIComponent(link.split(/[?#]/)[0].slice(base.length));
        const target = path.endsWith('/') ? `${path}index.html` : path;
        expect(existsSync(dist(target.replace(/^\//, ''))), `${page}: ${link}`).toBe(true);
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
    expect(home).toContain(publicPath('/notes/'));
    expect(html('notes/index.html')).toContain(publicPath('/notes/first-agent/'));
    expect(html('notes/index.html')).toContain(publicPath('/notes/better-prompts/'));
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

describe('restored branding and content', () => {
  it('restores the AX monogram and the original moon/sun controls', () => {
    const home = html('index.html');
    expect(home).toContain('/ax-monogram.svg');
    expect(home).toContain('theme-icon-moon');
    expect(home).toContain('theme-icon-sun');
    expect(home).toContain('hero-intro');
    expect(home).toContain('일이 달라지는');
  });
  it('preserves the articles and series added after the pinned submodule commit', () => {
    expect(html('notes/context-handoff/index.html')).toContain('Agent에게 건네는 작업 메모 네 줄');
    expect(existsSync(dist('notes/free-cloud-compute-for-agents/index.html'))).toBe(true);
    expect(html('series/working-with-agents/index.html')).toContain('Agent와 일하는 연습');
  });
});
