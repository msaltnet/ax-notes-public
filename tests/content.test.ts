import { describe, expect, it } from 'vitest';
import { assertContentIntegrity, publishedNotes, type NoteRecord } from '../src/lib/content';

const note = (id: string, overrides: Partial<NoteRecord['data']> = {}): NoteRecord => ({
  id,
  data: {
    id,
    title: id,
    date: '2026-09-27',
    type: 'story',
    ...overrides,
  },
});

describe('content integrity', () => {
  it('rejects a front matter ID that differs from the file ID', () => {
    expect(() => assertContentIntegrity([{ ...note('first'), data: { ...note('first').data, id: 'other' } }], [])).toThrow(/file ID/i);
  });

  it('rejects duplicate note IDs and missing series references', () => {
    expect(() => assertContentIntegrity([note('same'), note('same')], [])).toThrow(/duplicate note ID/i);
    expect(() => assertContentIntegrity([note('first', { series: 'missing', series_order: 1 })], [])).toThrow(/unknown series/i);
  });

  it('requires unique positive positions within a series', () => {
    expect(() => assertContentIntegrity([note('first', { series: 'log' })], ['log'])).toThrow(/series_order/i);
    expect(() => assertContentIntegrity([
      note('first', { series: 'log', series_order: 1 }),
      note('second', { series: 'log', series_order: 1 }),
    ], ['log'])).toThrow(/duplicate series order/i);
  });
});

describe('published notes', () => {
  it('excludes drafts and sorts newest first', () => {
    const results = publishedNotes([
      note('old', { date: '2026-01-01' }),
      note('draft', { date: '2026-12-01', draft: true }),
      note('new', { date: '2026-09-27' }),
    ]);
    expect(results.map(({ id }) => id)).toEqual(['new', 'old']);
  });
});
