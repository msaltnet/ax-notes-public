import { getCollection, type CollectionEntry } from 'astro:content';
import { assertContentIntegrity, publishedNotes } from './content';
import { tagSlug } from './paths';

export type Note = CollectionEntry<'notes'>;
export type Series = CollectionEntry<'series'>;

export async function getSiteContent() {
  const [rawNotes, series] = await Promise.all([getCollection('notes'), getCollection('series')]);
  for (const item of series) {
    if (item.id !== item.data.id) throw new Error(`Series file ID ${item.id} differs from front matter ID ${item.data.id}`);
  }
  assertContentIntegrity(rawNotes, series.map(({ id }) => id));
  const notes = publishedNotes(rawNotes);
  const tagMap = new Map<string, { label: string; slug: string; count: number }>();
  for (const note of notes) {
    for (const label of note.data.tags) {
      const slug = tagSlug(label);
      const current = tagMap.get(slug);
      if (current) current.count += 1;
      else tagMap.set(slug, { label, slug, count: 1 });
    }
  }
  return {
    notes,
    series: series.sort((a, b) => a.data.title.localeCompare(b.data.title)),
    tags: [...tagMap.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
  };
}
