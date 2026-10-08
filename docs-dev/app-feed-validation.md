# App feed implementation validation

Verified on 2026-10-07 against source baseline `6ffd29e21f292dda046b83664101f2e597f734ee` in the separate `web-final/` checkout. The earlier `web/` checkout and source patch remain preserved.

## Results

- Dependency install from the updated lockfile: `npm ci` passed
- Default GitHub subpath: `npm run verify` passed, 6 test files / 47 tests
- Production root: `SITE_URL=https://ax.msalt.net BASE_PATH=/ npm run verify` passed, 6 test files / 47 tests
- Astro diagnostics: 0 errors, 0 warnings, 0 hints
- Real-pipeline synthetic draft: `npm run test:feed:draft` passed; its temporary future-dated draft was absent from the manifest, detail output, website route and RSS, and its source was removed
- HTTP smoke against Astro preview in both production-root and GitHub-subpath configurations: manifest and all 8 revision-addressed details returned HTTP 200 with `application/json`; each detail's ID/revision matched the manifest; every optimized article image returned a nonempty image response; the removed build source and an unknown revision returned HTTP 404
- Publication output: 8 published notes, including `first-vibe-coding`; 8 corresponding details; the existing public article content and source assets remain unchanged
- Security coverage: active markup, event handlers, inline styles, unsafe schemes and credential-bearing links removed; article text, headings, tables and Aftertaste preserved
- URL coverage: root and GitHub-subpath builds verified, with same-origin article links and images checked against actual built files
- Hash coverage: stable canonical hashing verified; body and metadata-only edits invalidate a revision
- Final generated `docs/` output uses `https://ax.msalt.net/` and includes the feed

No commit, push, PR, publication or deployment was performed. These tests establish local build behavior, not a live production rollout.

## Deliverables and choices

- Manifest URL: `https://ax.msalt.net/app/v1/manifest.json`
- Detail URL: `https://ax.msalt.net/app/v1/notes/{id}/{revision}.json`
- Author identity: existing public `AX Notes` brand; unverified social channels remain empty
- Published dates retain source `YYYY-MM-DD`; `updatedAt` remains `null`
- Project links use the existing public project overview at `/series/{id}/`
- The build consumes `getSiteContent()`, then extracts the final built article after Astro image processing
- Development contract: `docs-dev/app-feed-contract.md`
- Regression tests: `tests/app-feed.test.ts`, `tests/fixtures/app-feed-notes.json`, `scripts/check-app-feed-draft.mjs`

The sibling `feed-fixture-final/` directory contains a copy of the production manifest and all detail JSON for Android demo assets. The final build output is left intact. Existing generated differences in tag/project ordering and Pagefind output are build/locale artifacts; no source content was reverted or changed to hide them. A source-only patch excludes generated `docs/` output.

## Pinned upstream compatibility and Android asset comparison

The final baseline is fixed at `6ffd29e21f292dda046b83664101f2e597f734ee`; later upstream commits were intentionally not incorporated. The existing feed source patch applied cleanly, with no feed-code compatibility edits required.

The upstream switch to AstroContainer-rendered article HTML, first-body-image OG/Twitter previews, default 1731×909 brand image, README addition, and new social-image regression test are preserved without modification. The full suite now has 47 tests rather than the earlier 46.

Compared with the production feed built from `a9c27bbc3985cc3dd4ad5d3aff970768ec79c956`:

- All 8 notes have identical IDs, summaries, revision hashes, HTML and text
- Detail JSON files are byte-for-byte identical
- There are no added, removed or changed notes
- Author metadata is unchanged
- The manifest is identical after omitting only `generatedAt`
- Existing Android demo assets do **not** require rebundling for correctness; the new fixture is available if the build timestamp should be refreshed

The sibling `feed-fixture-final-comparison.json` records the per-note comparison. The new source-only patch is `axnotes-web-feed-final.patch`, verified against a clean archive of the pinned baseline; the original `axnotes-web-feed.patch` is not replaced.

## Execution environment notes

This workspace's default npm/Astro cache directories were not writable. Verification used `npm_config_cache=/tmp/axnotes-npm-cache`, `XDG_CONFIG_HOME=/tmp/axnotes-config`, and `ASTRO_TELEMETRY_DISABLED=1`; these are execution-only environment overrides, not repository changes. Node.js was v24.19.0 and npm was v11.9.0.

The current static host does not guarantee retention of old detail revisions after a new deployment. The revision-addressed path fails safely with 404 instead of serving new content for an old revision; client refresh and cache behavior is documented in the contract. JSON caching alone does not make remote images available offline.
