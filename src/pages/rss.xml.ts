import rss from '@astrojs/rss';
import { getSiteContent } from '../lib/data';
import { noteHref } from '../lib/links';

export async function GET(context: { site: URL | undefined }) {
  const { notes } = await getSiteContent();
  return rss({
    title: 'AX Notes',
    description: '일과 기술의 변화를 직접 만들고 기록하는 작은 노트.',
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
