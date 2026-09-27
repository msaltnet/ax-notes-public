import { getCollection, type CollectionEntry } from 'astro:content';
import { assertContentIntegrity, buildTagIndex, publishedNotes } from './content';

export type Note = CollectionEntry<'notes'>;
export type Series = CollectionEntry<'series'>;

export async function getSiteContent() {
  const [rawNotes, series] = await Promise.all([getCollection('notes'), getCollection('series')]);
  for (const item of series) {
    if (item.id !== item.data.id) throw new Error(`Series file ID ${item.id} differs from front matter ID ${item.data.id}`);
  }
  assertContentIntegrity(rawNotes, series.map(({ id }) => id));
  const notes = publishedNotes(rawNotes);
  return {
    notes,
    series: series.sort((a, b) => a.data.title.localeCompare(b.data.title)),
    tags: buildTagIndex(notes),
  };
}
