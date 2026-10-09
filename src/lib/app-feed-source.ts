import { publishedNotes, type NoteRecord } from './content';
import { withBase } from './paths';

type FeedNote = NoteRecord & { data: NoteRecord['data'] & { description: string } };
type FeedCollection = { id: string; data: { type: 'series' | 'project'; title: string } };

/** The same publication policy as the website, also applied defensively here. */
export function buildFeedSource(notes: FeedNote[], collections: FeedCollection[], site: URL, base: string) {
  if (site.protocol !== 'https:') throw new Error('App feed SITE_URL must use HTTPS');
  const url = (path: string) => new URL(withBase(base, path), site).href;
  const byId = new Map(collections.map((collection) => [collection.id, collection]));
  return {
    schemaVersion: 1,
    siteRoot: url('/'),
    author: { name: 'AX Notes', aboutUrl: url('/about/'), channels: [] },
    notes: publishedNotes(notes).map((note) => {
      const collection = note.data.collection ? byId.get(note.data.collection) : undefined;
      const project = collection?.data.type === 'project' ? collection : undefined;
      const series = collection?.data.type === 'series' ? collection : undefined;
      // Use authored collection identity/title/order, never infer groups from note titles.
      return {
        id: note.id,
        title: note.data.title,
        description: note.data.description,
        publishedAt: note.data.date,
        updatedAt: null,
        canonicalUrl: url(`/notes/${note.id}/`),
        collectionId: note.data.collection ?? null,
        projectUrl: project ? url(`/series/${project.id}/`) : null,
        projectId: project?.id ?? null,
        projectTitle: project?.data.title ?? null,
        projectOrder: project ? note.data.collection_order ?? null : null,
        seriesId: series?.id ?? null,
        seriesTitle: series?.data.title ?? null,
        seriesOrder: series ? note.data.collection_order ?? null : null,
      };
    }),
  };
}
