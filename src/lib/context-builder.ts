export const contextFields = [
  { key: 'role', title: 'My Role', label: '내 역할', hint: '예: 제품 기획자. 고객 문제를 정의하고 팀의 우선순위를 정한다.' },
  { key: 'goals', title: 'My Goals', label: '목표', hint: '예: 고객 피드백을 더 빠르게 제품 개선으로 연결한다.' },
  { key: 'tasks', title: 'My Recurring Tasks', label: '반복 업무', hint: '예: 주간 회의 정리, 고객 인터뷰 분석, 제안서 작성' },
  { key: 'criteria', title: 'Decision Criteria', label: '판단 기준', hint: '예: 근거가 있는가? 고객 영향과 구현 비용은 어떠한가?' },
  { key: 'tools', title: 'Tools', label: '사용하는 도구', hint: '예: 문서, 스프레드시트, 이슈 관리 도구' },
  { key: 'output', title: 'Output Preferences', label: '원하는 출력', hint: '예: 한국어, 핵심부터, 근거 링크와 다음 행동을 포함' },
] as const;
export type ContextInput = Partial<Record<(typeof contextFields)[number]['key'], string>>;
export function buildContext(input: ContextInput): string {
  if (!contextFields.some(({ key }) => input[key]?.trim())) return '';
  return '# My Work Context\n\n' + contextFields.map(({ key, title }) =>
    `## ${title}\n\n${input[key]?.trim() || '직접 작성해주세요.'}`
  ).join('\n\n') + '\n';
}
