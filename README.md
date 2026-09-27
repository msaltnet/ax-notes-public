# AX Notes Public — 개발 설계

공개 가능한 글만 소유하는 독립 정적 사이트입니다. 이 저장소와 빌드 파이프라인에는 Inside 코드·콘텐츠·주소·자격 증명이 들어오지 않습니다. Inside는 이 저장소의 공개 Markdown과 이미지 자산을 **읽기 전용**으로 가져갈 수 있습니다.

> 상태: 구현 전 설계안. 이 README를 검토한 뒤 사이트 코드를 작성합니다.

## 만들 결과

- Notes 목록과 글 상세, Story / Build / Tip / Take 분류, Tags, Series, About
- Pagefind 정적 검색, RSS, SEO·Open Graph, 다크 모드
- X·Threads로 연결되는 공개 사이트 링크와 공개 글 공유
- GitHub Actions에서 정적 빌드 후 GitHub Pages 배포
- 댓글, 좋아요, 공개 조회수, PWA, 백엔드, DB, Inside 연동은 만들지 않음

## 기술과 배포 경계

- Astro + TypeScript로 정적 HTML을 생성합니다. Markdown만 콘텐츠 입력으로 허용하고 MDX 및 콘텐츠 안의 실행 스크립트는 사용하지 않습니다.
- Pagefind는 Astro 빌드가 끝난 공개 HTML을 색인합니다. 검색에 서버나 DB를 사용하지 않습니다.
- `SITE_URL`과 Pages의 `base`를 배포 환경에서 설정합니다. RSS, canonical URL, Open Graph는 이 값을 공통으로 사용합니다. 도메인이 미정이어도 로컬 빌드는 가능하게 만듭니다.
- Analytics는 공급자와 공개 범위가 결정된 뒤 공개 사이트에서만 별도 설정합니다. 키나 내부 분석 endpoint를 저장소에 넣지 않습니다.
- GitHub Actions에는 이 저장소의 Pages 배포에 필요한 최소 권한만 부여합니다. 사내 서비스로 향하는 네트워크 요청과 Inside 관련 secret은 없습니다.

## 콘텐츠 계약

글은 `src/content/notes/<id>.md`에 둡니다. 발행 후 `id`를 바꾸지 않고, 파일명과 `id`를 일치시킵니다. URL은 `/notes/<id>/`로 고정합니다. 제목을 바꿔도 Inside overlay의 연결과 기존 링크가 유지됩니다.

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

필수 필드는 `id`, `title`, `description`, `date`, `type`입니다. `type`은 `story | build | tip | take` 중 하나입니다. `tags`는 문자열 목록, `series`는 선택적 단일 ID이며 Series가 있으면 양의 정수 `series_order`도 필수입니다. 날짜는 `YYYY-MM-DD`, ID는 소문자·숫자·하이픈만 허용합니다. 빌드에서 필수 값, ID 중복, 파일명 불일치, 존재하지 않는 Series와 중복된 Series 순서를 검사합니다. `draft: true` 글은 목록·상세·검색·RSS·사이트맵에 포함하지 않습니다.

Series 메타데이터는 `src/content/series/`에 별도 Markdown으로 둡니다. 태그는 글의 `tags`에서 생성하며 같은 표기는 하나로 정규화합니다. 공개 이미지는 `public/media/<id>/`에 두고 글에서 `/media/<id>/파일명`으로 참조합니다. 이미지 형식은 PNG·JPEG·WebP·AVIF로 제한합니다. 이렇게 하면 Inside 빌드가 공개 이미지도 함께 복사해 정적으로 제공할 수 있습니다. 외부 이미지 URL과 Markdown 원시 HTML은 초기 범위에서 사용하지 않습니다.

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

## 예상 파일 구조

```text
src/
  content/notes/          공개 글 Markdown
  content/series/         Series 메타데이터
  lib/content/            스키마, ID·참조 검증, 목록 정렬
  components/             카드, 배지, 탐색, 테마 전환
  layouts/                공통 화면과 글 레이아웃
  pages/                  위 경로의 정적 페이지와 rss.xml
public/media/<id>/        공개 이미지·첨부파일
tests/                    콘텐츠 계약과 경로 검증
.github/workflows/        공개 빌드·Pages 배포
```

## 구현 순서와 확인 방법

1. Astro 프로젝트와 콘텐츠 스키마를 만들고 샘플 공개 글로 `id`·날짜·타입·Series 검증을 확인합니다.
2. 목록·상세·태그·Series·About을 구현하고 고정 URL과 draft 제외를 확인합니다.
3. 반응형 화면, 다크 모드, 검색, RSS, SEO·Open Graph를 연결합니다.
4. GitHub Pages 빌드·배포를 설정하고 Public 저장소 단독 checkout에서 성공하는지 확인합니다.
5. 소스·Actions 설정·빌드 산출물에 Inside 정보가 없고, 콘텐츠·이미지·링크에 공개 불가 정보가 없는지 검토합니다.

완료 기준은 공개 글 하나가 목록·상세·태그·검색·RSS에 일관되게 나타나고, draft는 어떤 공개 산출물에도 나타나지 않으며, Public 빌드가 Inside 저장소 없이 통과하는 것입니다.

사내 경험을 공개 글로 쓰려면 이 저장소에서 새로 작성하고 본문·front matter·이미지·파일명·링크·Git 기록을 사람이 검토합니다. Inside → Public 자동 게시·export·동기화는 추가하지 않습니다.
