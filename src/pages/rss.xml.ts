import rss from '@astrojs/rss';
import { getSiteContent } from '../lib/data';
import { noteHref } from '../lib/links';
import { render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { sanitizeArticle } from '../lib/app-feed.mjs';

export async function GET(context: { site: URL | undefined }) {
  const { notes } = await getSiteContent();
  const site = new URL(import.meta.env.BASE_URL, context.site ?? new URL('https://msaltnet.github.io'));
  const container = await AstroContainer.create();
  const items = await Promise.all(notes.map(async (note) => {
    const { Content } = await render(note);
    const link = new URL(noteHref(note.id), site).href;
    const body = await container.renderToString(Content, { request: new Request(link) });
    const aftertaste = note.data.aftertaste
      ? `<aside><p>${note.data.aftertaste.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</p></aside>`
      : '';
    const { bodyHtml } = await sanitizeArticle(`<article class="article-body">${body}${aftertaste}</article>`, link, site.href, { preserveEmailLinks: true });
    return {
      title: note.data.title,
      description: note.data.description,
      pubDate: new Date(`${note.data.date}T00:00:00+09:00`),
      link,
      content: bodyHtml,
    };
  }));
  return rss({
    title: 'AX Notes',
    description: 'AI로 일하는 방식을 바꾸며 배우고 생각한 것들.',
    site,
    items,
    customData: '<language>ko-KR</language>',
  });
}
