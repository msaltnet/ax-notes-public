import { publishedNotes, type NoteRecord } from './content';
import { withBase } from './paths';

type FeedNote = NoteRecord & { data: NoteRecord['data'] & { description: string } };
type FeedCollection = { id: string; data: { type: 'series' | 'project' } };

/** The same publication policy as the website, also applied defensively here. */
export function buildFeedSource(notes: FeedNote[], collections: FeedCollection[], site: URL, base: string) {
  if (site.protocol !== 'https:') throw new Error('App feed SITE_URL must use HTTPS');
  const url = (path: string) => new URL(withBase(base, path), site).href;
  return {
    schemaVersion: 1,
    siteRoot: url('/'),
    author: { name: 'AX Notes', aboutUrl: url('/about/'), channels: [] },
    notes: publishedNotes(notes).map((note) => ({
      id: note.id,
      title: note.data.title,
      description: note.data.description,
      publishedAt: note.data.date,
      updatedAt: null,
      canonicalUrl: url(`/notes/${note.id}/`),
      collectionId: note.data.collection ?? null,
      projectUrl: collections.some((collection) => collection.id === note.data.collection && collection.data.type === 'project')
        ? url(`/series/${note.data.collection}/`)
        : null,
    })),
  };
}
