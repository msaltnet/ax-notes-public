import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    id, title: z.string().min(1), description: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    tags: z.array(z.string().min(1)).default([]),
    collection: id.optional(), collection_order: z.number().int().positive().optional(),
    aftertaste: z.string().min(1).optional(),
    draft: z.boolean().default(false),
  }).strict(),
});
const common = { id, title: z.string().min(1), description: z.string().min(1) };
const collectionEntries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/collections' }),
  schema: z.discriminatedUnion('type', [
    z.object({ ...common, type: z.literal('series') }).strict(),
    z.object({
      ...common, type: z.literal('project'), goal: z.string().min(1),
      status: z.enum(['planned', 'in-progress', 'completed', 'paused']),
      planned_notes: z.number().int().positive().optional(),
      result: z.string().regex(/^\/labs\/[a-z0-9-]+\/$/).optional(),
    }).strict(),
  ]),
});
export const collections = { notes, collections: collectionEntries };
