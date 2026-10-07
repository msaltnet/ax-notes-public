# AX Notes Public

> **악소리 나는 AX 경험담.** AI로 일하는 방식을 바꾸며 배우고 생각한 것들.

공개 가능한 경험을 기록하고 작은 AX 도구를 제공하는 독립 Astro 정적 사이트입니다. Inside 저장소·콘텐츠·빌드에 의존하지 않습니다.

## 콘텐츠

모든 글은 Note입니다. 카테고리와 편집 라벨은 사용하지 않습니다. aftertaste는 글 끝의 한 문장입니다.

Note는 src/content/notes/<id>.md에 둡니다. id·title·description·date는 필수이고 tags·collection·collection_order·aftertaste·draft는 선택적입니다. id는 파일명과 일치하며 URL /notes/<id>/는 유지합니다. collection은 최대 하나이고 지정하면 양의 정수 collection_order가 필수입니다.

Collection은 src/content/collections/<id>.md에 둡니다. id·title·description·type은 필수입니다. type: series는 주제 탐구, type: project는 목표와 결과물의 제작 기록입니다. Project에는 goal과 status(planned / in-progress / completed / paused)가 필수이며 planned_notes와 result(/labs/<id>/)를 선택적으로 사용합니다.

날짜는 따옴표로 감싼 YYYY-MM-DD입니다. 중복 ID, 잘못된 파일명, 없는 Collection, 누락·중복 순서는 빌드 오류입니다. draft는 목록·상세·검색·RSS·진행률에서 제외합니다. 기존 이미지 경로와 /series/<id>/ 주소를 유지합니다.

Project와 Series의 대표 이미지는 cover_image에 Markdown 파일 기준 상대 경로로 지정하고 cover_alt에 이미지 설명을 적습니다. Project는 홈의 프로젝트 소개, Projects 목록 카드, 프로젝트 상세 상단에 표시합니다. Series는 목록 카드에 표시하며, 이미지가 없으면 연재 번호를 사용합니다. 목록 카드는 큰 화면에서 왼쪽 260px 이미지와 오른쪽 설명을 배치하고 작은 화면에서는 세로로 표시합니다. 이미지는 원래 비율을 유지하며 빌드에서 최적화합니다.

화면 검증용 샘플 글과 샘플 연재는 삭제했습니다. Labs는 준비될 때까지 공개 경로·메뉴·홈·About에서 숨깁니다. Context Builder 페이지 코드는 src/disabled-pages/labs에 보관하며 빌드에 포함하지 않습니다. 소개용 글과 Project 항목은 삭제했습니다.

## 화면과 Labs

메뉴는 Notes · Series · Projects · About · Search입니다. Series는 연재만, Projects는 프로젝트만 보여줍니다. 프로젝트 목록은 /projects/이며 기존 Collection 상세 주소 /series/<id>/는 유지합니다. 태그는 Notes와 글 상세에서 접근합니다. 홈은 Hero → Featured Note → Projects → Latest Notes 순서입니다.

Labs는 콘텐츠 Collection이 아니라 실제 도구입니다. 첫 Lab은 Context Builder입니다. Role·Goals·Recurring Tasks·Decision Criteria·Tools·Output Preferences를 Markdown으로 정리하고 복사·다운로드합니다. 입력은 브라우저에서만 처리하고 서버 전송·자동 저장하지 않습니다.

Project는 제작 과정을, Lab은 사용할 결과물을 제공합니다. AX Work Mapper, Agent Readiness Check, Agent Design Canvas는 아이디어 단계입니다.

X는 기술과 Insight, Threads는 경험과 고민을 공유합니다. 글 상세의 공유 링크와 RSS를 제공합니다. 계정 URL은 확정 후 추가합니다. 댓글·좋아요·공개 조회수·뉴스레터·계정·결제·PWA·Native App은 V1 범위 밖입니다.

## 실행과 검증

Node.js 22.19 이상 또는 Node.js 24 LTS를 권장합니다. 기존 lockfile을 사용합니다.

```bash
npm ci
npm run dev
npm run verify
npm run preview
```

verify는 Astro 타입 검사 → 정적 빌드 → Pagefind → Vitest 순서입니다. 검색·RSS·canonical·OG·Dark Mode·하위 경로를 유지합니다. SITE_URL과 BASE_PATH로 도메인과 경로를 설정하며 기본 주소는 https://msaltnet.github.io/ax-notes-public/입니다.

## GitHub Pages

.github/workflows/deploy.yml은 PR에서 검증만 하고 main push 또는 수동 dispatch에서 검증한 docs를 https://ax.msalt.net에 배포합니다. Node 22를 사용합니다. Pages source를 GitHub Actions로 설정하세요. 코드 변경만으로 실제 배포가 완료되지는 않습니다.

기존 npm run deploy는 수동 gh-pages 게시용으로 남아 있습니다. Actions 운영 시에는 워크플로를 기준으로 게시하고 별도로 수동 게시하지 않습니다. Analytics는 공급자 확정 후 추가하며 내부 endpoint나 credential은 Public에 두지 않습니다.

Public / Inside / Both는 편집 선택입니다. Both 원고는 공개 가능한 내용으로 작성하여 사람이 양쪽에 각각 발행합니다. 자동 동기화·overlay는 없습니다. Inside 경험을 외부에 쓰려면 이 저장소에서 Public 글을 새로 작성합니다.

Public 저장소는 https://github.com/msaltnet/ax-notes-public 입니다. 이 저장소에서 직접 글과 사이트를 관리하며 이전 저장소의 자동 동기화는 사용하지 않습니다.

## SNS 공유 이미지

글에 본문 이미지가 있으면 첫 번째 이미지의 빌드 URL과 크기를 OG 및 Twitter 공유 메타데이터에 사용합니다. 본문 이미지가 없는 글과 일반 페이지는 public/og.png를 기본 이미지로 사용합니다. 기본 이미지를 바꾸려면 해당 파일을 교체합니다.

현재 기본 이미지는 [ChatGPT에서 만든 AX Notes SNS 이미지](https://chatgpt.com/s/m_6ac62105b0c88191be80abb8df41f04b)의 원본(1731×909)을 사용합니다.
