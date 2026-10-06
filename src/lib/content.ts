import { tagSlug } from './paths';

export type NoteRecord = {
  id: string;
  data: {
    id: string;
    title: string;
    date: string;

    draft?: boolean;
    collection?: string;
    collection_order?: number;
  };
};

export function assertContentIntegrity(notes: NoteRecord[], collectionIds: string[]): void {
  const knownCollection = new Set(collectionIds);
  const seenNotes = new Set<string>();
  const seenPositions = new Set<string>();

  for (const note of notes) {
    if (seenNotes.has(note.id)) throw new Error(`Duplicate note ID: ${note.id}`);
    seenNotes.add(note.id);
    if (note.id !== note.data.id) throw new Error(`File ID ${note.id} differs from front matter ID ${note.data.id}`);

    const { collection, collection_order: order } = note.data;
    if (collection && !knownCollection.has(collection)) throw new Error(`Unknown collection: ${collection}`);
    if (collection && (!Number.isInteger(order) || (order ?? 0) < 1)) {
      throw new Error(`collection_order must be a positive integer for ${note.id}`);
    }
    if (!collection && order !== undefined) throw new Error(`collection_order requires collection for ${note.id}`);
    if (collection) {
      const key = `${collection}:${order}`;
      if (seenPositions.has(key)) throw new Error(`Duplicate collection order: ${key}`);
      seenPositions.add(key);
    }
  }
}

export function publishedNotes<T extends NoteRecord>(notes: T[]): T[] {
  return notes
    .filter(({ data }) => !data.draft)
    .sort((a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id));
}

export function buildTagIndex(notes: Array<{ data: { tags: string[] } }>) {
  const tagMap = new Map<string, { label: string; slug: string; count: number }>();
  for (const note of notes) {
    for (const label of note.data.tags) {
      const slug = tagSlug(label);
      const current = tagMap.get(slug);
      if (current && current.label !== label) {
        throw new Error(`Tag slug collision: ${current.label} and ${label} both map to ${slug}`);
      }
      if (current) current.count += 1;
      else tagMap.set(slug, { label, slug, count: 1 });
    }
  }
  return [...tagMap.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
