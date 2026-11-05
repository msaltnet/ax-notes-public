# 「ChatGPT로 맛자국 만들기」 연재 기획안

> 상태: 기획 / 미발행  
> 발행처: [AX Notes](https://ax.msalt.net) · [ax-notes-public](https://github.com/msaltnet/ax-notes-public)  
> 개발 프로젝트: [맛자국 (Mealory)](https://github.com/msaltnet/mealory) — 현재 비공개 저장소

## 무엇을 쓰는가

**ChatGPT와 대화하는 것만으로 실제 Android 앱을 어디까지 만들 수 있을까?**

맛자국은 가고 싶은 맛집(Before)에서 방문 기록(After), 추억(Memory)으로 이어지는 개인 기록 앱이다. ChatGPT를 개발의 중심에 두고 요구사항 결정, 구현 요청, GitHub PR, 테스트, 내부 APK까지 진행한 과정을 **재미있는 사건 중심**으로 기록한다.

이 연재는 Android 개발 튜토리얼이나 AI 도구 사용법 설명이 아니다. **무엇을 AI에게 맡겼고, 결과를 보며 사람은 어떤 결정을 내렸는가**를 보여주는 실제 경험담이다.

### 편집 원칙

- 미리 긴 연재를 확정하지 않는다. **우선 1편을 쓰고**, 이야기 가치가 있으면 다음 편을 진행한다.
- 실제 대화, PR, 앱 화면 등 확인 가능한 사례만 쓴다. AI가 한 일과 사람이 확인한 일을 구분한다.
- **놀라움, 시행착오, 방향 전환**이 없는 내용은 굳이 쓰지 않는다.
- 기존 AX Notes의 [「AX Notes 앱도 만들어볼까?」](https://ax.msalt.net/notes/ax-notes-app-requirements-first/)와 [「PRD·TRD 꼭 작성해야 할까?」](https://ax.msalt.net/notes/vibe-coding-docs-first/)에서 다룬 일반적인 기획/문서 작성 이야기는 반복하지 않는다.
- 글은 짧고 개인적인 경험 중심으로 쓴다(권장 1,000~1,500자). 인상적인 실제 화면·대화·결과물 2~4개와 짧은 `aftertaste`를 활용한다.
- 정확한 발행 날짜, 전체 편수, 다음 시즌은 지금 정하지 않는다.

## 우선 검토할 이야기 3개

### 1. ChatGPT랑 대화했더니 Android 앱이 만들어졌다 — 첫 글

**독자가 궁금할 장면:** IDE에서 직접 개발하거나 코딩 에이전트를 별도로 실행하는 것이 아니라, ChatGPT 대화가 GitHub PR과 설치 가능한 Android 빌드로 이어지는 경험.

- 어떻게 시작했는지: 맛집 기록 앱을 만들자는 첫 요청과 제품의 초기 형태.
- 실제 작업 흐름: 대화 → 작업 요청 → PR → 확인·머지 → 빌드/테스트.
- 정말 손을 대지 않은 부분과 직접 판단·확인한 부분을 솔직하게 구분.
- 결론보다 질문을 남긴다: **이 방식으로 어디까지 개발할 수 있을까?**

**확인할 근거:** [초기 PRD/TRD PR #1](https://github.com/msaltnet/mealory/pull/1), [초기 Android 통합 PR #12](https://github.com/msaltnet/mealory/pull/12), [내부 테스트 APK 검증 PR #51](https://github.com/msaltnet/mealory/pull/51). 실제 대화와 빌드 산출물은 원고 작성 시 확인.

**주의:** 기존 AX Notes 앱 개발기와 겹치지 않게, 'ChatGPT 대화창 중심의 개발 경험'과 실제 결과에 집중한다.

### 2. 열심히 만들었는데, 다시 뜯어고쳤다 — 후보

**핵심 사건:** 처음의 음식 기록/일기 성격에서 Before → After → Memory로 UX가 바뀌었고, 구현 후에도 After와 Memory가 겹쳐 상태 흐름을 다시 정리했다.

- 왜 처음 구조가 어색했는지: 사용하면서 발견한 불편.
- ChatGPT가 만든 결과를 보고 요구사항을 다시 바꾼 과정.
- **구현 가능한 기능과 정말 필요한 기능은 다르다**는 깨달음.

**확인할 근거:** [3탭 재설계 PR #13](https://github.com/msaltnet/mealory/pull/13), [상태 분리 PR #42](https://github.com/msaltnet/mealory/pull/42). 초기/변경 후 화면 비교를 우선 확보.

### 3. 맛집 이름 하나 저장하는 게 이렇게 복잡할 일인가? — 후보

**핵심 사건:** URL이나 식당 이름 하나만 넣고 싶었는데 스마트 입력, 장소 검색, 지도, 카카오 API, Vercel DEV 백엔드와 인증까지 연결된 과정.

- 사용자는 입력을 최소화하고 싶었다.
- 이를 구현하려다 생긴 기술적 복잡성과 선택.
- **사용자 화면은 단순해질수록 구현은 복잡해질 수 있다.**

**확인할 근거:** [스마트 입력 PR #44](https://github.com/msaltnet/mealory/pull/44), [Android 공유 PR #46](https://github.com/msaltnet/mealory/pull/46), [Vercel 장소 검색 PR #52](https://github.com/msaltnet/mealory/pull/52), [Google ID 토큰 PR #58](https://github.com/msaltnet/mealory/pull/58).

2·3편은 **소재 후보**이지 발행 약속이 아니다. 1편을 발행한 뒤 실제 개발 과정에서 더 재미있는 사건이 생기면 교체하거나 생략한다.

## AX Notes에 올리는 방식

- 기존 콘텐츠 체계를 유지한다. 연재를 실제로 시작할 때 `src/content/collections/`에 **Project** 타입의 맛자국 컬렉션을 등록한다.
- 글은 `src/content/notes/`의 기존 Note 형식(필수 frontmatter, `collection`, `collection_order`, `aftertaste`)으로 작성한다.
- 아직 공개할 준비가 되지 않은 글은 `draft: true`로 관리한다.
- **지금은 기획안만 저장한다.** 사이트 Project 등록, 글 게시, 자동 배포는 별도 작업으로 한다.

## 공개 전 확인할 것

- 개발 저장소 `msaltnet/mealory`는 비공개이므로 PR 링크가 일반 독자에게 열리지 않을 수 있다. 글 자체에 공개 가능한 화면·대화 발췌·결과를 제공한다.
- 토큰, API 키, 계정·개인 위치와 음식 기록 등 민감한 정보는 공개하지 않는다.
- 실제 사용한 ChatGPT 기능, PR 생성·검증 범위, APK 실행 여부를 근거와 함께 확인한다. **'전부 알아서 완료'처럼 과장하지 않는다.**

## 바로 다음 작업

**첫 글 한 편만 작성**한다. 시작할 때의 실제 대화, 초기 PR, 테스트 APK 또는 빌드 기록, 인상적인 스크린샷을 수집하고 원고를 작성해 검토용 PR로 올린다. 이후 발행 여부와 다음 소재를 결정한다.
