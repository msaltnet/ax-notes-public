import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

// A real Astro integration check, independent of the currently published articles.
const id = 'app-feed-synthetic-draft';
const sentinel = 'APP_FEED_PRIVATE_DRAFT_SENTINEL';
const path = new URL(`../src/content/notes/${id}.md`, import.meta.url);
await writeFile(path, `---\nid: ${id}\ntitle: "${sentinel}"\ndescription: "Synthetic draft regression fixture"\ndate: "2099-01-01"\ndraft: true\n---\n\n${sentinel}\n`, { flag: 'wx' });
try {
  const result = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, 'Astro build must succeed with a valid synthetic draft');
  const manifest = await readFile(new URL('../docs/app/v1/manifest.json', import.meta.url), 'utf8');
  assert.ok(!manifest.includes(id));
  assert.ok(!manifest.includes(sentinel));
  assert.ok(!existsSync(new URL(`../docs/app/v1/notes/${id}/`, import.meta.url)));
  assert.ok(!existsSync(new URL(`../docs/notes/${id}/`, import.meta.url)));
  assert.ok(!(await readFile(new URL('../docs/rss.xml', import.meta.url), 'utf8')).includes(id));
  assert.ok(!existsSync(new URL('../docs/app-feed-build-source.json', import.meta.url)));
  console.log('Synthetic draft integration passed: absent from manifest, details, website and RSS');
} finally {
  await unlink(path);
}
