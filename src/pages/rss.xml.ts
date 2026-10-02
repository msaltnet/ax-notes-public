import rss from '@astrojs/rss';
import { getSiteContent } from '../lib/data';
import { noteHref } from '../lib/links';

export async function GET(context: { site: URL | undefined }) {
  const { notes } = await getSiteContent();
  return rss({
    title: 'AX Notes',
    description: 'AI로 일하는 방식을 바꾸며 배우고 생각한 것들.',
    site: new URL(import.meta.env.BASE_URL, context.site ?? new URL('https://dev-team-404.github.io')),
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: new Date(`${note.data.date}T00:00:00+09:00`),
      link: noteHref(note.id),
    })),
    customData: '<language>ko-KR</language>',
  });
}
