import { describe, expect, it } from 'vitest';
import { withBase, tagSlug } from '../src/lib/paths';

describe('site paths', () => {
  it('keeps GitHub Pages links under the configured base', () => {
    expect(withBase('/ax-notes-public/', '/notes/example/')).toBe('/ax-notes-public/notes/example/');
    expect(withBase('/', '/notes/example/')).toBe('/notes/example/');
  });

  it('creates stable readable tag slugs', () => {
    expect(tagSlug('AI Coding')).toBe('ai-coding');
    expect(tagSlug('악! AX')).toBe('악-ax');
  });
});
