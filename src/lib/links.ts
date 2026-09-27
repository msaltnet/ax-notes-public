import { withBase } from './paths';

export const href = (path: string) => withBase(import.meta.env.BASE_URL, path);
export const noteHref = (id: string) => href(`/notes/${id}/`);
export const tagHref = (slug: string) => href(`/tags/${slug}/`);
export const seriesHref = (id: string) => href(`/series/${id}/`);
