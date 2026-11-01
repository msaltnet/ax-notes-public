/** Open off-site article links in a new tab after sanitization. */
export default function rehypeExternalLinks({ site }) {
  const siteUrl = new URL(site);

  function visit(node) {
    if (node.type === 'element' && node.tagName === 'a' && node.properties?.href) {
      let url;
      try {
        url = new URL(String(node.properties.href), siteUrl);
      } catch {
        return;
      }
      if (['http:', 'https:'].includes(url.protocol) && url.origin !== siteUrl.origin) {
        node.properties.target = '_blank';
        node.properties.rel = [...new Set([
          ...String(node.properties.rel ?? '').split(/[\s,]+/).filter(Boolean),
          'noopener',
          'noreferrer',
        ])];
      }
    }
    for (const child of node.children ?? []) visit(child);
  }

  return visit;
}
