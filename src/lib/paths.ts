export function withBase(base: string, path: string): string {
  const prefix = base.replace(/\/+$/, '');
  return `${prefix}/${path.replace(/^\/+/, '')}`;
}

export function tagSlug(tag: string): string {
  return tag.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
}
