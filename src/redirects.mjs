// ax.msalt.net -> msalt.net redirect map. GitHub Pages cannot send HTTP 301,
// so every old URL becomes a static page with meta refresh + canonical.
export const TARGET = 'https://msalt.net';

export const NOTE_SLUGS = [
  'ai-is-scale', 'ax-notes-app-requirements-first', 'cognitive-surrender-human-surrender',
  'dots-and-muse-delegated-tasks', 'dots-ax-notes-beta-testers', 'dots-connected',
  'first-vibe-coding', 'free-cloud-compute-for-agents', 'free-llm-apis',
  'nanobot-bot-selection', 'nanobot-requirements-first', 'nanobot-telegram',
  'nanobot-ubuntu-setup', 'value-maxxing-leadership', 'vibe-coding-docs-first',
];
export const SERIES_IDS = ['ax-notes-app', 'dots-and-muse', 'nanobot', 'vibe-coding-workflow'];

const AX = `${TARGET}/ax/`;

/** @returns {Map<string, string>} output path (relative to the site root) -> destination URL */
export function redirectMap() {
  const map = new Map();
  map.set('index.html', AX);
  for (const page of ['notes', 'series', 'tags', 'about', 'projects', 'search']) map.set(`${page}/index.html`, AX);
  for (const slug of NOTE_SLUGS) map.set(`notes/${slug}/index.html`, `${TARGET}/article/${slug}/`);
  for (const id of SERIES_IDS) map.set(`series/${id}/index.html`, `${AX}#series-${id}`);
  // Unknown paths (including old tag pages): GitHub Pages serves 404.html.
  map.set('404.html', AX);
  return map;
}

export function redirectHtml(url) {
  const href = url.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>msalt.net으로 이동했습니다</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${href}">
<meta http-equiv="refresh" content="0; url=${href}">
<script>location.replace(${JSON.stringify(url).replace(/</g, '\u003c')});</script>
</head>
<body>
<p>AX Notes는 <a href="${href}">msalt.net</a>으로 옮겼습니다.</p>
</body>
</html>
`;
}

export function rssNotice() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>AX Notes (moved to msalt.net)</title>
<link>${AX}</link>
<description>AX Notes는 msalt.net으로 옮겼습니다. 새 피드: ${TARGET}/feed.xml</description>
<item><title>피드 주소가 바뀌었습니다</title><link>${TARGET}/feed.xml</link><guid isPermaLink="false">ax-feed-moved</guid>
<description>새 피드 주소는 ${TARGET}/feed.xml 입니다.</description></item>
</channel></rss>
`;
}
