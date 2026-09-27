# AX Notes Public — 개발 설계

공개 가능한 글만 소유하는 독립 정적 사이트입니다. 이 저장소와 빌드 파이프라인은 공개 콘텐츠만 읽고 공개 사이트만 배포합니다.

> 상태: Public MVP 구현·`gh-pages` 게시 완료. GitHub Pages의 게시 원본 설정은 확인이 필요합니다. 아래의 두 샘플 글은 화면·검색·RSS 검증용이며 실제 경험담이 아닙니다.

## 만들 결과

- 전체 글을 모아 보는 목록과 각 글의 본문 페이지
- 글의 성격을 나타내는 유형(Story / Tip / Take), 주제별 태그, 연재 묶음, 작성자 소개
- Pagefind 정적 검색, RSS, SEO·Open Graph, 다크 모드
- 공개 글의 X·Threads 공유 링크
- 로컬에서 정적 사이트를 빌드·검증한 뒤 생성 파일을 GitHub Pages에 게시
- 댓글, 좋아요, 공개 조회수, PWA, 백엔드, DB는 만들지 않음

여기서 **Notes**는 게시글 전체를 가리키는 이름입니다. 세 유형은 별도 사이트나 메뉴가 아니라 글마다 하나씩 붙이는 라벨입니다. 제작·실험 기록도 Story에 포함합니다.

| 용어 | 뜻 | 예시 |
| --- | --- | --- |
| Story | 경험, 관찰, 제작·실험 과정을 풀어 쓴 글 | 팀의 AI 도구 경험, Agent 제작 기록 |
| Tip | 바로 적용할 수 있는 짧은 방법 | AX Tip |
| Take | 생각이나 의견을 분명히 밝힌 글 | Salty Take |
| Tag | 여러 글에 붙일 수 있는 주제 표시 | Agent, MCP |
| Series | 순서대로 읽는 연재 묶음 | 팀의 AI 실험 1·2·3편 |
| About | 작성자와 AX Notes를 소개하는 페이지 | 이 사이트를 쓰는 이유 |

`악! AX`는 원래 제안에 있는 코너명입니다. 세 유형과 별도로 어떤 글을 묶을지 검토 중이며, 구현 전에 위치를 확정합니다.
`Build Log`는 독립 유형으로 만들지 않습니다. 개별 제작 기록에는 태그를 붙이고, 여러 편을 순서대로 읽게 할 때만 Series로 묶습니다.

## 기술과 배포 경계

- Astro + TypeScript로 정적 HTML을 생성합니다. Markdown만 콘텐츠 입력으로 허용하고 MDX 및 콘텐츠 안의 실행 스크립트는 사용하지 않습니다.
- Pagefind는 Astro 빌드가 끝난 공개 HTML을 색인합니다. 검색에 서버나 DB를 사용하지 않습니다.
- `SITE_URL`과 Pages의 `base`를 로컬 배포 설정에서 지정합니다. RSS, canonical URL, Open Graph는 이 값을 공통으로 사용합니다. 도메인이 미정이어도 로컬 빌드는 가능하게 만듭니다.
- Analytics는 공급자와 공개 범위가 결정된 뒤 공개 사이트에서만 별도 설정합니다. 키나 내부 분석 endpoint를 저장소에 넣지 않습니다.
- 로컬에서 콘텐츠 검증 → Astro 빌드 → Pagefind 색인 → 산출물 확인 순서로 실행합니다. 확인된 `dist/`만 `gh-pages` 브랜치 루트에 게시하고, GitHub Pages는 해당 브랜치를 그대로 제공합니다. GitHub Actions 빌드·배포는 설정하지 않습니다.
- 배포 권한은 공개 저장소의 `gh-pages` 브랜치 쓰기로 한정합니다. 로컬 배포 스크립트에는 비공개 서비스 주소나 자격 증명을 넣지 않습니다.

## 콘텐츠 계약

글은 `src/content/notes/<id>.md`에 둡니다. 발행 후 `id`를 바꾸지 않고, 파일명과 `id`를 일치시킵니다. URL은 `/notes/<id>/`로 고정하므로 제목을 바꿔도 기존 링크가 유지됩니다.

```yaml
---
id: claude-code-team
title: "Claude Code를 팀에서 사용하며 느낀 5가지"
description: "팀에서 도구를 시험하며 얻은 공개 가능한 관찰"
date: 2026-09-27
type: story
tags: [AI Coding, Agent]
series: team-ai-experiments # 선택 사항
series_order: 1 # series가 있으면 필수
draft: false # 선택 사항, 기본값 false
---
```

필수 필드는 `id`, `title`, `description`, `date`, `type`입니다. `type`은 `story | tip | take` 중 하나입니다. `tags`는 문자열 목록, `series`는 선택적 단일 ID이며 Series가 있으면 양의 정수 `series_order`도 필수입니다. 날짜는 `YYYY-MM-DD`, ID는 소문자·숫자·하이픈만 허용합니다. 빌드에서 필수 값, ID 중복, 파일명 불일치, 존재하지 않는 Series와 중복된 Series 순서를 검사합니다. `draft: true` 글은 목록·상세·검색·RSS·사이트맵에 포함하지 않습니다.

Series 메타데이터는 `src/content/series/`에 별도 Markdown으로 둡니다. 태그는 글의 `tags`에서 생성하며 같은 표기는 하나로 정규화합니다. 글의 공개 이미지는 `src/content/notes/assets/<id>/`에 두고 본문에서 `![대체 텍스트](./assets/<id>/파일명.png)`처럼 참조합니다. Astro가 이미지 URL에 배포 경로를 붙여 출력하므로 Pages 하위 경로에서도 연결됩니다. 이미지 형식은 PNG·JPEG·WebP·AVIF로 제한합니다. 외부 이미지 URL과 Markdown 원시 HTML은 초기 범위에서 사용하지 않습니다.

## 화면과 경로

| 경로 | 역할 |
| --- | --- |
| `/` | 최신 공개 글, 타입별 진입점, 소개 |
| `/notes/` | 날짜 역순 목록과 타입·태그 탐색 |
| `/notes/<id>/` | 글 상세, Series 연결, 공개 공유 링크 |
| `/tags/`, `/tags/<tag>/` | 태그 목록과 태그별 글 |
| `/series/`, `/series/<id>/` | Series 목록과 순서대로 읽기 |
| `/search/` | Pagefind 검색 |
| `/about/` | 작성자와 사이트 소개 |
| `/rss.xml` | 발행된 공개 글만 포함하는 RSS |

모바일 우선 레이아웃을 적용하고 키보드 탐색·명도 대비·이미지 대체 텍스트를 확인합니다. 글 상세에는 타입, 날짜, 태그, Series를 표시합니다. 검색과 RSS에는 공개된 글만 들어갑니다.

## 파일 구조

```text
src/
  content/notes/          공개 글 Markdown
  content/series/         Series 메타데이터
  content.config.ts       콘텐츠 스키마
  lib/                    ID·참조 검증, 목록 정렬, 경로
  components/             카드, 배지, 탐색, 테마 전환
  layouts/                공통 화면과 글 레이아웃
  pages/                  위 경로의 정적 페이지와 rss.xml
src/content/notes/assets/<id>/  글별 공개 이미지
tests/                    콘텐츠 계약과 경로 검증
package.json              로컬 빌드·검증·Pages 게시 명령
```

## 구현 순서와 확인 방법

1. Astro 프로젝트와 콘텐츠 스키마를 만들고 샘플 공개 글로 `id`·날짜·타입·Series 검증을 확인합니다.
2. 목록·상세·태그·Series·About을 구현하고 고정 URL과 draft 제외를 확인합니다.
3. 반응형 화면, 다크 모드, 검색, RSS, SEO·Open Graph를 연결합니다.
4. 로컬에서 빌드·검증하고 `dist/`를 `gh-pages` 브랜치에 게시하는 스크립트를 만듭니다. Public 저장소 단독 checkout에서 빌드가 성공하는지 확인합니다.
5. 소스·로컬 배포 설정·빌드 산출물의 콘텐츠·이미지·링크에 공개 불가 정보가 없는지 검토합니다.

완료 기준은 공개 글 하나가 목록·상세·태그·검색·RSS에 일관되게 나타나고, draft는 어떤 공개 산출물에도 나타나지 않으며, 이 저장소만으로 빌드가 통과하는 것입니다.

비공개 경험을 공개 글로 쓰려면 이 저장소에서 새로 작성하고 본문·front matter·이미지·파일명·링크·Git 기록을 사람이 검토합니다. 비공개 자료를 자동 변환해 게시하는 기능은 추가하지 않습니다.

## 로컬 실행과 게시

Node.js 22 이상에서 실행합니다. 기본 배포 주소는 `https://dev-team-404.github.io/ax-notes-public/`로 설정되어 있습니다.

```bash
npm ci
npm run dev       # 로컬 개발 서버
npm run verify    # 타입 검사 → 정적 빌드·Pagefind → 테스트
npm run preview   # 빌드 산출물 확인
npm run deploy    # verify 후 dist/를 gh-pages 브랜치에 게시
```

도메인을 바꾸면 로컬 배포 전에 `SITE_URL`과 `BASE_PATH`를 설정합니다. `SITE_URL`은 사이트 원점(예: `https://example.com`), `BASE_PATH`는 경로 접두사(예: `/ax-notes-public` 또는 `/`)입니다. GitHub 저장소 설정에서 Pages의 게시 원본을 `gh-pages` 브랜치의 루트로 지정해야 합니다. 게시 명령은 로컬에서만 실행하고, GitHub Actions 빌드는 사용하지 않습니다.

현재 구현에는 두 개의 샘플 글(`first-agent`, `better-prompts`), 한 개의 샘플 Series, 공개 글 검색·RSS·사이트맵·Open Graph·다크 모드가 포함됩니다. Analytics 공급자, 실제 도메인, X·Threads 프로필 주소는 아직 정하지 않았으므로 추적 코드와 프로필 링크는 넣지 않았습니다.
