import { describe, it, expect } from 'vitest';
import { computeTmb, computeMaintenanceEstimate } from './computeTmb';
import type { TmbInput } from './computeTmb';

function makeInput(overrides: Partial<TmbInput>): TmbInput {
  return {
    weight: 80,
    height: 180,
    unitSystem: 'metric',
    age: 30,
    sex: 'male',
    ...overrides,
  };
}

describe('computeTmb', () => {
  it('computes Mifflin-St Jeor for a metric male', () => {
    // Arrange
    const input = makeInput({});

    // Act
    const result = computeTmb(input);

    // Assert
    expect(result).toBe(Math.round(10 * 80 + 6.25 * 180 - 5 * 30 + 5));
  });

  it('rounds the result', () => {
    // Arrange
    const input = makeInput({ weight: 80.05 });

    // Act
    const result = computeTmb(input);

    // Assert
    expect(result).toBe(Math.round(10 * 80.05 + 6.25 * 180 - 5 * 30 + 5));
    expect(result).toBe(1781);
  });

  it('applies the female offset', () => {
    // Arrange
    const input = makeInput({ sex: 'female' });

    // Act
    const result = computeTmb(input);

    // Assert
    expect(result).toBe(Math.round(10 * 80 + 6.25 * 180 - 5 * 30 - 161));
  });

  it('converts imperial units before computing', () => {
    // Arrange
    const input = makeInput({ unitSystem: 'imperial', weight: 176.37, height: 70.87 });

    // Act
    const result = computeTmb(input);

    // Assert
    expect(result).toBe(Math.round(10 * 176.37 * 0.453592 + 6.25 * 70.87 * 2.54 - 5 * 30 + 5));
  });
});

describe('computeMaintenanceEstimate', () => {
  it('multiplies the rounded tmb by the training-frequency factor', () => {
    // Arrange
    const input = makeInput({});

    // Act
    const result = computeMaintenanceEstimate(input, 'moderate');

    // Assert
    expect(result.tmb).toBe(1780);
    expect(result.factor).toBe(1.55);
    expect(result.calories).toBe(Math.round(1780 * 1.55));
  });

  it('uses the sedentary factor when not training', () => {
    // Arrange
    const input = makeInput({});

    // Act
    const result = computeMaintenanceEstimate(input, 'none');

    // Assert
    expect(result.factor).toBe(1.2);
    expect(result.calories).toBe(Math.round(1780 * 1.2));
  });
});
