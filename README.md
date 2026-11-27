# ax-notes-public (redirect only)

AX Notes는 https://msalt.net 으로 통합되었습니다. 이 저장소는 ax.msalt.net의 옛 URL을 새 주소로 보내는 정적 이동 페이지만 배포합니다.
GitHub Pages는 HTTP 301을 보낼 수 없어 `meta refresh` + `rel=canonical` 페이지를 생성합니다.

| 옛 주소 | 새 주소 |
|---|---|
| `/notes/<slug>/` | `https://msalt.net/article/<slug>/` |
| `/series/<id>/` | `https://msalt.net/ax/#series-<id>` |
| `/`, `/notes/`, `/about/` 등 그 외 모든 경로(404 포함) | `https://msalt.net/ax/` |
| `/rss.xml` | 이동 안내 항목 1개 (새 피드: `https://msalt.net/feed.xml`) |

매핑은 `src/redirects.mjs`에 있습니다. 글이 추가로 옮겨지면 `NOTE_SLUGS`/`SERIES_IDS`를 갱신하세요.

```bash
npm run verify   # docs/ 생성 + 테스트 (의존성 없음, Node 22)
```

배포는 main push 시 GitHub Actions(Pages)로 합니다. 옛 AX Notes 전체 사이트는 git 이력(`ee34280`)에 있습니다.
