import { describe, it, expect } from 'vitest';
import { calculateAge } from './calculateAge';

const NOW = new Date(2026, 6, 7);

describe('calculateAge', () => {
  it('returns full years when the birthday already passed this year', () => {
    // Arrange
    const birthDate = '1996-03-15';

    // Act
    const result = calculateAge(birthDate, NOW);

    // Assert
    expect(result).toBe(30);
  });

  it('subtracts one when the birthday has not happened yet this year', () => {
    // Arrange
    const birthDate = '1996-11-20';

    // Act
    const result = calculateAge(birthDate, NOW);

    // Assert
    expect(result).toBe(29);
  });

  it('counts the birthday itself as already turned', () => {
    // Arrange
    const birthDate = '1996-07-07';

    // Act
    const result = calculateAge(birthDate, NOW);

    // Assert
    expect(result).toBe(30);
  });

  it('handles a leap-year birthday once it has passed this year', () => {
    // Arrange
    const birthDate = '2000-02-29';

    // Act
    const result = calculateAge(birthDate, NOW);

    // Assert
    expect(result).toBe(26);
  });

  it('has not turned the leap-year birthday yet on the day before it', () => {
    // Arrange
    const birthDate = '2000-02-29';
    const now = new Date(2026, 1, 28);

    // Act
    const result = calculateAge(birthDate, now);

    // Assert
    expect(result).toBe(25);
  });
});
