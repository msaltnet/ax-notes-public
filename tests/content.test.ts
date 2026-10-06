import { describe, expect, it } from 'vitest';
import { assertContentIntegrity, buildTagIndex, publishedNotes, type NoteRecord } from '../src/lib/content';
const note = (id: string, overrides: Partial<NoteRecord['data']> = {}): NoteRecord => ({
  id, data: { id, title: id, date: '2026-09-27', ...overrides },
});
describe('content integrity', () => {
  it('accepts standalone notes without a category', () => {
    expect(() => assertContentIntegrity([note('solo')], [])).not.toThrow();
  });
  it('rejects mismatched and duplicate note IDs', () => {
    expect(() => assertContentIntegrity([note('first', { id: 'other' })], [])).toThrow(/file ID/i);
    expect(() => assertContentIntegrity([note('same'), note('same')], [])).toThrow(/duplicate note ID/i);
  });
  it('rejects missing collection references', () => {
    expect(() => assertContentIntegrity([note('first', { collection: 'missing', collection_order: 1 })], [])).toThrow(/unknown collection/i);
  });
  it('requires positive, unique positions in either kind of collection', () => {
    expect(() => assertContentIntegrity([note('first', { collection: 'log' })], ['log'])).toThrow(/collection_order/i);
    expect(() => assertContentIntegrity([note('first', { collection: 'log', collection_order: 0 })], ['log'])).toThrow(/collection_order/i);
    expect(() => assertContentIntegrity([note('first', { collection: 'log', collection_order: 1 }), note('second', { collection: 'log', collection_order: 1 })], ['log'])).toThrow(/duplicate collection order/i);
  });
  it('rejects an order without a collection', () => {
    expect(() => assertContentIntegrity([note('first', { collection_order: 1 })], [])).toThrow(/requires collection/i);
  });
});
describe('published notes', () => {
  it('excludes drafts and sorts newest first', () => {
    expect(publishedNotes([note('old', { date: '2026-01-01' }), note('draft', { draft: true }), note('new')]).map(({ id }) => id)).toEqual(['new', 'old']);
  });
});
describe('tag index', () => {
  it('rejects colliding tag slugs', () => {
    expect(() => buildTagIndex([{ data: { tags: ['C++', 'C#'] } }])).toThrow(/tag slug collision/i);
  });
  it('counts shared topics across notes', () => {
    expect(buildTagIndex([{ data: { tags: ['Agent'] } }, { data: { tags: ['Agent', 'MCP'] } }])).toEqual([{ label: 'Agent', slug: 'agent', count: 2 }, { label: 'MCP', slug: 'mcp', count: 1 }]);
  });
});
