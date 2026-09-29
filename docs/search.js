const input = document.querySelector('#search-input');
const status = document.querySelector('#search-status');
const container = document.querySelector('#search-results');

if (input && status && container) {
  const baseUrl = new URL('.', import.meta.url).pathname;
  const bundleUrl = new URL('./pagefind/pagefind.js', import.meta.url);
  let sequence = 0;

  input.addEventListener('input', async () => {
    const query = input.value.trim();
    const current = ++sequence;
    container.replaceChildren();
    if (!query) { status.textContent = '검색어를 입력해 주세요.'; return; }
    status.textContent = '찾는 중…';

    try {
      const pagefind = await import(bundleUrl.href);
      await pagefind.options({ baseUrl });
      const search = await pagefind.search(query);
      if (current !== sequence) return;
      status.textContent = `${search.results.length}개의 기록을 찾았습니다.`;

      for (const item of search.results.slice(0, 20)) {
        const result = await item.data();
        if (current !== sequence) return;
        const link = document.createElement('a');
        link.className = 'search-result';
        link.href = result.url;
        const label = document.createElement('span');
        label.className = 'result-type';
        label.textContent = 'PUBLIC NOTE';
        const title = document.createElement('h2');
        title.textContent = result.meta.title;
        const excerpt = document.createElement('p');
        excerpt.textContent = result.plain_excerpt;
        link.append(label, title, excerpt);
        container.append(link);
      }
    } catch (error) {
      console.error('AX Notes search failed', error);
      status.textContent = '검색 색인을 열 수 없습니다. 빌드된 사이트에서 다시 시도해 주세요.';
    }
  });
}
