import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { redirectMap, redirectHtml, NOTE_SLUGS } from '../src/redirects.mjs';

test('notes map to msalt.net article pages', () => {
  const map = redirectMap();
  assert.equal(map.get('notes/ai-is-scale/index.html'), 'https://msalt.net/article/ai-is-scale/');
  assert.equal(map.get('series/nanobot/index.html'), 'https://msalt.net/ax/#series-nanobot');
  assert.equal(map.get('index.html'), 'https://msalt.net/ax/');
  assert.equal(map.get('404.html'), 'https://msalt.net/ax/');
});
test('every note slug is unique and has a page', () => {
  assert.equal(new Set(NOTE_SLUGS).size, NOTE_SLUGS.length);
  for (const s of NOTE_SLUGS) assert.ok(redirectMap().has(`notes/${s}/index.html`));
});
test('html has refresh and canonical, escapes attributes', () => {
  const html = redirectHtml('https://msalt.net/ax/#series-x');
  assert.match(html, /http-equiv="refresh" content="0; url=https:\/\/msalt\.net\/ax\/#series-x"/);
  assert.match(html, /rel="canonical" href="https:\/\/msalt\.net\/ax\/#series-x"/);
  assert.ok(!redirectHtml('https://a/?x="y"').includes('"y"'));
});
