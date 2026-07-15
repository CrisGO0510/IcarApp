import { describe, it, expect } from 'vitest';
import { buildWeeklyCalories, weekStart } from './weeklyCalories';

const SUNDAY = new Date('2026-07-19T15:00:00');
const WEDNESDAY = new Date('2026-07-15T09:00:00');

describe('weekStart', () => {
  it('returns the monday of the current week', () => {
    // Act
    const start = weekStart(WEDNESDAY);

    // Assert
    expect(start).toEqual(new Date(2026, 6, 13));
  });

  it('keeps sunday inside the week that started the previous monday', () => {
    // Act
    const start = weekStart(SUNDAY);

    // Assert
    expect(start).toEqual(new Date(2026, 6, 13));
  });
});

describe('buildWeeklyCalories', () => {
  it('builds seven days monday to sunday with L-D labels', () => {
    // Act
    const weekly = buildWeeklyCalories([], [], null, WEDNESDAY);

    // Assert
    expect(weekly.days.map((day) => day.label)).toEqual(['L', 'M', 'X', 'J', 'V', 'S', 'D']);
    expect(weekly.days[0]?.date).toBe('2026-07-13');
    expect(weekly.days[6]?.date).toBe('2026-07-19');
  });

  it('sums consumed and burned calories per day', () => {
    // Arrange
    const consumed = [
      { date: '2026-07-15', calories: 500 },
      { date: '2026-07-15', calories: 700.5 },
      { date: '2026-07-14', calories: 300 },
    ];
    const burned = [
      { date: '2026-07-15', calories: 200 },
      { date: '2026-07-15', calories: 100 },
    ];

    // Act
    const weekly = buildWeeklyCalories(consumed, burned, 2000, WEDNESDAY);

    // Assert
    expect(weekly.days[2]).toMatchObject({ date: '2026-07-15', consumed: 1200.5, burned: 300 });
    expect(weekly.days[1]).toMatchObject({ date: '2026-07-14', consumed: 300, burned: 0 });
  });

  it('ignores entries outside the current week', () => {
    // Arrange
    const consumed = [
      { date: '2026-07-12', calories: 999 },
      { date: '2026-07-20', calories: 999 },
    ];

    // Act
    const weekly = buildWeeklyCalories(consumed, [], 2000, WEDNESDAY);

    // Assert
    expect(weekly.days.every((day) => day.consumed === 0)).toBe(true);
  });

  it('passes the goal through, including when missing', () => {
    // Act & Assert
    expect(buildWeeklyCalories([], [], 2200, WEDNESDAY).goal).toBe(2200);
    expect(buildWeeklyCalories([], [], null, WEDNESDAY).goal).toBeNull();
  });
});
