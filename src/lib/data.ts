import { getCollection, type CollectionEntry } from 'astro:content';
import { assertContentIntegrity, buildTagIndex, publishedNotes } from './content';
export type Note = CollectionEntry<'notes'>;
export type Series = CollectionEntry<'collections'>;
export const projectStatus = { planned: '계획 중', 'in-progress': '진행 중', completed: '완료', paused: '잠시 멈춤' };
export async function getSiteContent() {
  const [rawNotes, series] = await Promise.all([getCollection('notes'), getCollection('collections')]);
  for (const item of series) {
    if (item.id !== item.data.id) throw new Error(`Collection file ID ${item.id} differs from front matter ID ${item.data.id}`);
  }
  assertContentIntegrity(rawNotes, series.map(({ id }) => id));
  const notes = publishedNotes(rawNotes);
  return { notes, series: series.sort((a, b) => a.data.title.localeCompare(b.data.title)), tags: buildTagIndex(notes) };
}
