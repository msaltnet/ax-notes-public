import { describe, it, expect } from 'vitest';
import { buildContext } from '../src/lib/context-builder';
describe('Context Builder', () => {
  it('does not generate a document from blank input', () => {
    expect(buildContext({ role: '  ', goals: '\n' })).toBe('');
  });
  it('organizes the six sections without inventing missing context', () => {
    const result = buildContext({ role: '  기획자  ', tasks: '회의 정리\n고객 분석', criteria: '<script>alert(1)</script>' });
    expect(result).toContain('## My Role\n\n기획자');
    expect(result).toContain('## My Goals\n\n직접 작성해주세요.');
    expect(result).toContain('회의 정리\n고객 분석');
    expect(result).toContain('<script>alert(1)</script>');
    expect(result.match(/^## /gm)).toHaveLength(6);
    expect(result.endsWith('\n')).toBe(true);
  });
});
