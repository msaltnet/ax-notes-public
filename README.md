# AX Notes Public

공개 가능한 글만 보관하는 AX Notes의 외부 사이트 저장소입니다. 이 저장소와 CI는 Inside 저장소, 사내 서비스, 사내 자격 증명을 참조하지 않습니다.

## 콘텐츠

공개 글은 `src/content/notes/`에 Markdown으로 작성합니다. 각 글의 front matter에는 변경하지 않는 `id`, `title`, `date`, `type`을 둡니다. `type`은 `story`, `build`, `tip`, `take` 중 하나입니다.

사내 경험을 공개하려면 이 저장소에서 새로운 글로 일반화해 작성하고, 본문·front matter·이미지·파일명·링크·Git 기록에 내부 정보가 없는지 검토합니다.

## 구현 범위

Astro 정적 사이트, Notes/Series/Tags, Pagefind 검색, About, RSS, X/Threads 링크, Analytics, 다크 모드, SEO/Open Graph, GitHub Pages 배포를 구현합니다. 댓글, 좋아요, 공개 조회수, PWA, 백엔드, DB, Inside 연동은 범위에 넣지 않습니다.

전체 설계와 작업 순서는 상위 `ax-notes` 저장소의 `README.md`, `docs/architecture.md`, `docs/implementation-plan.md`를 따릅니다.
