import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { buildFeedSource } from '../src/lib/app-feed-source';
import { canonicalJson, noteRevision } from '../src/lib/app-feed.mjs';

const project = { id: 'nanobot', data: { type: 'project' as const, title: '나의 작은 에이전트 nanobot' } };
const series = { id: 'dots-and-muse', data: { type: 'series' as const, title: 'dots와 muse 사용기' } };
const note = (id: string, collection?: string, order?: number) => ({
  id, data: { id, title: 'An unrelated article title', description: 'Description', date: '2026-10-08', collection, collection_order: order },
});
const source = () => buildFeedSource([
  note('nanobot-telegram', 'nanobot', 4), note('dots-connected', 'dots-and-muse', 1), note('standalone'),
], [project, series], new URL('https://ax.msalt.net'), '/');

it('exports authored stable collection IDs, titles and order without classifying standalone note titles', () => {
  const notes = source().notes;
  expect(notes.find(({ id }) => id === 'nanobot-telegram')).toMatchObject({
    collectionId: 'nanobot', projectId: 'nanobot', projectTitle: project.data.title, projectOrder: 4,
    projectUrl: 'https://ax.msalt.net/series/nanobot/', seriesId: null, seriesTitle: null, seriesOrder: null,
  });
  expect(notes.find(({ id }) => id === 'dots-connected')).toMatchObject({
    collectionId: 'dots-and-muse', seriesId: 'dots-and-muse', seriesTitle: series.data.title, seriesOrder: 1,
    projectId: null, projectTitle: null, projectOrder: null, projectUrl: null,
  });
  expect(notes.find(({ id }) => id === 'standalone')).toMatchObject({
    collectionId: null, seriesId: null, seriesTitle: null, seriesOrder: null,
    projectId: null, projectTitle: null, projectOrder: null, projectUrl: null,
  });
});

it('hashes taxonomy-only corrections and still reproduces the original v1 hash with absent optional fields', () => {
  const metadata = source().notes.find(({ id }) => id === 'nanobot-telegram')!;
  const body = { bodyHtml: '<p>Body</p>', bodyText: 'Body' };
  const revision = noteRevision(metadata, body);
  expect(noteRevision({ ...metadata, projectTitle: 'Updated project title' }, body)).not.toBe(revision);
  expect(noteRevision({ ...metadata, projectOrder: 3 }, body)).not.toBe(revision);
  const { projectId, projectTitle, projectOrder, seriesId, seriesTitle, seriesOrder, ...legacy } = metadata;
  const legacyHash = createHash('sha256').update(canonicalJson({ schemaVersion: 1, ...legacy, ...body }), 'utf8').digest('hex');
  expect(noteRevision(legacy, body)).toBe(legacyHash);
});

describe('actual published taxonomy', () => {
  it('exports both series and both projects from the real web collections, with authored sequence', async () => {
    const manifest = JSON.parse(await readFile('docs/app/v1/manifest.json', 'utf8'));
    const notes = manifest.notes as ReturnType<typeof source>['notes'];
    expect(manifest.schemaVersion).toBe(1);
    expect(notes.filter((n) => n.projectId === 'nanobot').sort((a, b) => a.projectOrder! - b.projectOrder!).map((n) => [n.id, n.projectTitle, n.projectOrder])).toEqual([
      ['nanobot-requirements-first', '나의 작은 에이전트 nanobot', 1],
      ['nanobot-bot-selection', '나의 작은 에이전트 nanobot', 2],
      ['nanobot-ubuntu-setup', '나의 작은 에이전트 nanobot', 3],
      ['nanobot-telegram', '나의 작은 에이전트 nanobot', 4],
    ]);
    expect(notes.find((n) => n.id === 'ax-notes-app-requirements-first')).toMatchObject({
      projectId: 'ax-notes-app', projectTitle: 'AX Notes 앱 만들기', projectOrder: 1,
    });
    expect(notes.find((n) => n.id === 'dots-connected')).toMatchObject({
      seriesId: 'dots-and-muse', seriesTitle: 'dots와 muse 사용기', seriesOrder: 1,
    });
    expect(notes.find((n) => n.id === 'first-vibe-coding')).toMatchObject({
      seriesId: 'vibe-coding-workflow', seriesTitle: '나의 바이브 코딩 workflow', seriesOrder: 1,
    });
    for (const summary of notes) {
      expect(summary.projectId && summary.seriesId).toBeFalsy();
      if (summary.projectId) expect(summary.collectionId).toBe(summary.projectId);
      if (summary.seriesId) expect(summary.collectionId).toBe(summary.seriesId);
    }
  });
});
