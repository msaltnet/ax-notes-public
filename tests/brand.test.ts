import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
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
    expect(html('series/index.html')).toContain('PROJECT');
    expect(html('series/context-builder/index.html')).toContain('진행 중');
    expect(html('series/context-builder/index.html')).toContain('/labs/context-builder/');
  });
  it('offers a context form and download action', () => {
    const page = html('labs/context-builder/index.html');
    expect(page).toContain('id="context-form"');
    expect(page).toContain('id="download-context"');
    expect(page).toContain('서버로 전송하지');
  });
});
