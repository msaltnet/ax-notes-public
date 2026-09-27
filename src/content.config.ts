import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    id,
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    type: z.enum(['story', 'tip', 'take']),
    tags: z.array(z.string().min(1)).default([]),
    series: id.optional(),
    series_order: z.number().int().positive().optional(),
    draft: z.boolean().default(false),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: z.object({
    id,
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});

export const collections = { notes, series };
