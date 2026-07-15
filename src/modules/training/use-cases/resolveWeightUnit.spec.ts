import { describe, it, expect } from 'vitest';
import { resolveWeightUnit } from './resolveWeightUnit';

describe('resolveWeightUnit', () => {
  it("uses the exercise's own unit when set", () => {
    expect(resolveWeightUnit({ weightUnit: 'lb' }, 'metric')).toBe('lb');
    expect(resolveWeightUnit({ weightUnit: 'kg' }, 'imperial')).toBe('kg');
  });

  it('falls back to kg for a metric profile', () => {
    expect(resolveWeightUnit({}, 'metric')).toBe('kg');
  });

  it('falls back to lb for an imperial profile', () => {
    expect(resolveWeightUnit({}, 'imperial')).toBe('lb');
  });

  it('defaults to kg when nothing is provided', () => {
    expect(resolveWeightUnit(null, undefined)).toBe('kg');
    expect(resolveWeightUnit(undefined, undefined)).toBe('kg');
  });
});
