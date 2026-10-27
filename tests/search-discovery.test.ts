import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';

const read = (path: string) => readFileSync(`docs/${path}`, 'utf8');
const base = (process.env.BASE_PATH ?? '/ax-notes-public').replace(/\/+$/, '');
const root = new URL(`${base}/`, process.env.SITE_URL ?? 'https://msaltnet.github.io');

describe('search discovery', () => {
  it('allows crawlers and advertises the deployed sitemap', () => {
    expect(read('robots.txt')).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', root).href}\n`);
  });

  it('publishes full HTML articles with portable image and link URLs in RSS', () => {
    const feed = new XMLParser().parse(read('rss.xml')).rss.channel;
    const items = feed.item;
    const note = items.find((item: { link: string }) => item.link.endsWith('/notes/nanobot-bot-selection/'));
    expect(note['content:encoded']).toContain('OpenClaw 핑계로 맥북 구매');
    expect(note['content:encoded']).toContain('OpenClaw, NanoClaw, nanobot');
    expect(note['content:encoded']).toContain('카파시의 유튜브 영상 보기');
    expect(note['content:encoded']).toContain('다음 챕터: Ubuntu 설치');
    expect(note['content:encoded']).toMatch(/<img[^>]+src="https:\/\//);
    for (const item of items) {
      const body = item['content:encoded'];
      expect(body, item.link).toBeTruthy();
      expect(body.length, item.link).toBeGreaterThan(item.description.length);
      expect(body).not.toMatch(/href="(?!https:\/\/|mailto:)/);
      expect(body).not.toMatch(/src="(?!https:\/\/)/);
      expect(body).not.toContain('<script');
    }
    const manifest = JSON.parse(read('app/v1/manifest.json'));
    expect(items.map((item: { link: string }) => item.link).sort()).toEqual(manifest.notes.map((note: { canonicalUrl: string }) => note.canonicalUrl).sort());
  });

  it('keeps the beta signup email action in the full article', () => {
    const items = new XMLParser().parse(read('rss.xml')).rss.channel.item;
    const note = items.find((item: { link: string }) => item.link.endsWith('/notes/dots-ax-notes-beta-testers/'));
    expect(note['content:encoded']).toContain('href="mailto:msalt.net.help@gmail.com?subject=');
  });
});
