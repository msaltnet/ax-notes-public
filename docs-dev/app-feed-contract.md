# AX Notes app feed v1

The website remains the source of truth. The Android reader consumes static JSON emitted by the existing Astro build. No account, database, private content, mobile-only content copy, or runtime API server is introduced.

## URLs

- Production manifest: `https://ax.msalt.net/app/v1/manifest.json`
- Production detail: `https://ax.msalt.net/app/v1/notes/{id}/{revision}.json`
- GitHub Pages manifest: `https://msaltnet.github.io/ax-notes-public/app/v1/manifest.json`
- GitHub Pages detail: `https://msaltnet.github.io/ax-notes-public/app/v1/notes/{id}/{revision}.json`

`SITE_URL` and `BASE_PATH` select the domain and mount point for **all** canonical, author, project, detail and local article asset URLs. The default Astro configuration remains the existing GitHub Pages subpath. The existing Actions production configuration uses `SITE_URL=https://ax.msalt.net BASE_PATH=/`. A non-HTTPS `SITE_URL` fails the feed build.

## Manifest

The top-level properties are `schemaVersion: 1`, `generatedAt` (ISO 8601 UTC build timestamp), `author`, and `notes`.

`author` contains `name`, `aboutUrl`, and `channels: [{ label, url }]`. `name` is the existing public publication identity, **AX Notes**, rather than an invented personal author name. `aboutUrl` opens the published About page. `channels` is currently empty: the README says X/Threads account URLs are not finalized, and article share-intent URLs are not author accounts.

Each note summary contains:

| Field | Contract |
| --- | --- |
| `id` | Stable existing content ID, also used by the website route |
| `title`, `description` | Existing editorial metadata |
| `publishedAt` | Existing quoted `YYYY-MM-DD` date, with no invented time zone or time |
| `updatedAt` | `null` until explicit authored update metadata is supported |
| `canonicalUrl` | Absolute HTTPS public article URL |
| `detailUrl` | Absolute HTTPS revision-addressed JSON URL |
| `revision` | Lowercase 64-character SHA-256 digest |
| `collectionId` | Existing collection ID or `null` |
| `projectUrl` | Public `/series/{collectionId}/` project overview if the collection is a project; otherwise `null` |

The existing project overview route is intentionally preserved. This URL does not point to an unpublished Lab or an inferred external repository. Notes are sorted newest-first by the website's publication policy, with ID as the stable date-tie ordering.

## Detail and revision

A detail contains exactly `schemaVersion: 1`, `id`, `revision`, `bodyHtml`, and `bodyText`. `bodyHtml` is only the rendered article body, including authored Aftertaste when present. It excludes the page header, site navigation, footer, sharing links and metadata sidebar. The manifest carries title/description/date separately.

The revision hashes the UTF-8 bytes of canonical JSON containing these keys: `schemaVersion`, `id`, `title`, `description`, `publishedAt`, `updatedAt`, `canonicalUrl`, `collectionId`, `projectUrl`, `bodyHtml`, `bodyText`. Canonical JSON recursively sorts object keys lexicographically, preserves array order, uses ordinary JSON string escaping, and has no insignificant whitespace. `generatedAt`, `revision`, and `detailUrl` are excluded. A metadata-only correction changes the revision; an otherwise identical rebuild does not.

The revision-addressed path prevents a cached manifest from accidentally fetching a different revision under the same detail URL. Static deployment replaces the site tree, so old revision files are **not guaranteed to remain available** after publication. On 404 or ID/revision mismatch, the client should keep its valid cached detail, refresh the manifest once, and retry that note's current detail URL. It must never overwrite a good cached detail with an error page or mismatched revision. Complete manifest omissions remove notes from the current published list; local bookmarks can retain their ID without presenting a removed note as currently published. This feed adds no server-side download or bookmark state.

## Safe rendering

The exporter parses final built HTML, so Astro's optimized image filenames and actual public URLs are reused. It finds exactly one `article.article-body`, rejects an unexpected layout, and applies `rehype-sanitize` with an explicit allowlist. Safe headings, paragraphs, links, lists, quotes, images, code and tables survive. Scripts, styles, iframes, forms, SVG, embedded objects, media widgets, event handlers, inline styles, `srcset`, and arbitrary attributes do not. Only absolute HTTPS `href`/`src` values survive; HTTP URLs are upgraded to HTTPS. Unsafe schemes and credential-bearing URLs are removed. Plain text is derived from the sanitized tree.

Apps should still disable JavaScript and local-file/content access in their HTML renderer, intercept external navigation, and avoid treating the feed as executable code. Images remain normal HTTPS website resources; caching JSON does not by itself make images available offline.

## Build pipeline

1. The build-only `app-feed-build-source.json.ts` endpoint calls `getSiteContent()` and hands its published metadata to `buildFeedSource`. That helper defensively applies the same `publishedNotes` policy again.
2. Astro renders the website and processes images normally.
3. The `ax-notes-app-feed` build integration reads the temporary metadata output and final article HTML, sanitizes bodies, computes revisions, then writes `docs/app/v1/manifest.json` and details.
4. The temporary metadata file is removed. Any missing article or unexpected layout fails the build. Pagefind and the existing tests continue normally.

The mobile feed is a **static build artifact**; use `npm run build` followed by `npm run preview` to inspect it, rather than expecting the final feed from `astro dev`. `docs/` is generated output. Feed source and this contract live outside it.

## Verification

```sh
npm ci
npm run verify
SITE_URL=https://ax.msalt.net BASE_PATH=/ npm run verify
SITE_URL=https://ax.msalt.net BASE_PATH=/ npm run test:feed:draft
```

`tests/app-feed.test.ts` covers the schema shape, note sorting, synthetic draft exclusion, body sanitization, safe URL normalization, source-file removal, deterministic metadata-sensitive hashes, every current detail path, and same-origin link/image targets. The current `first-vibe-coding` article is published and is explicitly expected in the output; draft coverage uses `tests/fixtures/app-feed-notes.json` instead.

`test:feed:draft` additionally inserts a temporary, future-dated synthetic draft into the real Astro content pipeline, builds, checks that no manifest/detail/web/RSS entry is emitted, and removes the temporary source in `finally`. It refuses to overwrite any existing file. Run it without a concurrent web build.

`docs-dev/app-feed-validation.md` records the completed implementation checks. Nothing in this change pushes, publishes, or deploys the feed by itself.
