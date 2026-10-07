import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
const html = (path: string) => readFileSync('docs/' + path, 'utf8');

describe('AX Notes operating model', () => {
  it('introduces the brand and keeps Labs hidden', () => {
    const home = html('index.html');
    expect(home).toContain('악소리 나는 AX 경험담.');
    expect(home).toContain('Featured Note');
    expect(home).toContain('Projects');
    for (const path of ['index.html', 'about/index.html', 'notes/index.html']) {
      expect(html(path)).not.toContain('/labs/');
      expect(html(path)).not.toContain('From the Lab');
    }
    expect(existsSync('docs/labs/index.html')).toBe(false);
    expect(existsSync('docs/labs/context-builder/index.html')).toBe(false);
    expect(existsSync('docs/series/context-builder/index.html')).toBe(false);
    expect(existsSync('docs/notes/context-builder-start/index.html')).toBe(false);
  });
  it('renders Aftertaste without editorial labels or category filtering', () => {
    expect(html('notes/free-llm-apis/index.html')).toContain('Aftertaste');
    for (const path of ['index.html', 'notes/index.html', 'notes/free-llm-apis/index.html']) {
      expect(html(path)).not.toContain('AX Tip');
      expect(html(path)).not.toContain('type-label');
      expect(html(path)).not.toContain('Salty Take');
    }
    expect(html('notes/index.html')).not.toContain('data-filter="story"');
  });
  it('distinguishes projects from exploratory series and removes sample content', () => {
    expect(html('projects/index.html')).toContain('PROJECT /');
    expect(html('projects/index.html')).toContain('나의 작은 에이전트 nanobot');
    expect(html('series/index.html')).toContain('나의 바이브 코딩 workflow');
    expect(html('series/index.html')).not.toContain('나의 작은 에이전트 nanobot');
    expect(html('projects/index.html')).not.toContain('Context Builder 만들기');
    for (const id of ['first-agent', 'better-prompts', 'agent-review-loop', 'automation-review-time', 'context-handoff', 'definition-of-done', 'small-task-boundaries']) {
      expect(existsSync(`docs/notes/${id}/index.html`)).toBe(false);
      expect(html('notes/index.html')).not.toContain(`/notes/${id}/`);
      expect(html('rss.xml')).not.toContain(`/notes/${id}/`);
      expect(html('sitemap-0.xml')).not.toContain(`/notes/${id}/`);
    }
    for (const id of ['field-notes', 'working-with-agents']) {
      expect(existsSync(`docs/series/${id}/index.html`)).toBe(false);
    }
  });
});
