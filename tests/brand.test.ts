import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
const html = (path: string) => readFileSync('docs/' + path, 'utf8');
describe('AX Notes operating model', () => {
  it('introduces the brand and an executable Lab', () => {
    const home = html('index.html');
    expect(home).toContain('악소리 나는 AX 경험담.');
    expect(home).toContain('Featured Note');
    expect(home).toContain('Projects');
    expect(home).toContain('From the Lab');
    expect(home).toContain('/labs/context-builder/');
  });
  it('renders Aftertaste without editorial labels or category filtering', () => {
    expect(html('notes/better-prompts/index.html')).toContain('Aftertaste');
    for (const path of ['index.html', 'notes/index.html', 'notes/better-prompts/index.html']) {
      expect(html(path)).not.toContain('AX Tip');
      expect(html(path)).not.toContain('type-label');
      expect(html(path)).not.toContain('Salty Take');
    }
    expect(html('notes/index.html')).not.toContain('data-filter="story"');
  });
  it('distinguishes projects from exploratory series', () => {
    expect(html('projects/index.html')).toContain('PROJECT /');
    expect(html('projects/index.html')).toContain('나의 작은 에이전트 nanobot');
    expect(html('projects/index.html')).not.toContain('Agent와 일하는 연습');
    expect(html('series/index.html')).toContain('Agent와 일하는 연습');
    expect(html('series/index.html')).not.toContain('나의 작은 에이전트 nanobot');
    expect(html('projects/index.html')).toContain('Context Builder 만들기');
    expect(existsSync('docs/series/context-builder/index.html')).toBe(true);
    expect(existsSync('docs/notes/context-builder-start/index.html')).toBe(true);
    expect(html('notes/index.html')).toContain('/notes/context-builder-start/');
    expect(html('rss.xml')).toContain('context-builder-start');
    expect(html('labs/index.html')).toContain('/series/context-builder/');
    expect(html('labs/context-builder/index.html')).toContain('/series/context-builder/');
  });
  it('offers a context form and download action', () => {
    const page = html('labs/context-builder/index.html');
    expect(page).toContain('id="context-form"');
    expect(page).toContain('id="download-context"');
    expect(page).toContain('서버로 전송하지');
  });
});
