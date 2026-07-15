import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRestTimerStore, REST_ENDS_AT_KEY, REST_CORNER_KEY } from './restTimer.store';

const store = new Map<string, string>();

const { scheduleMock, cancelMock } = vi.hoisted(() => ({
  scheduleMock: vi.fn(),
  cancelMock: vi.fn(),
}));

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(({ key }: { key: string }) => Promise.resolve({ value: store.get(key) ?? null })),
    set: vi.fn(({ key, value }: { key: string; value: string }) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    remove: vi.fn(({ key }: { key: string }) => {
      store.delete(key);
      return Promise.resolve();
    }),
  },
}));

vi.mock('src/core/native/restNotifications', () => ({
  scheduleRestReminder: scheduleMock,
  cancelRestReminder: cancelMock,
}));

describe('restTimer store', () => {
  const vibrateMock = vi.fn();

  beforeEach(() => {
    store.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-12T10:00:00Z'));
    vi.stubGlobal('navigator', { vibrate: vibrateMock });
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('starts a rest with an end timestamp and persists it', async () => {
    // Arrange
    const timer = useRestTimerStore();

    // Act
    await timer.startRest(90, { notify: true, vibrate: true });

    // Assert
    expect(timer.running).toBe(true);
    expect(timer.remaining).toBe(90);
    expect(timer.label).toBe('01:30');
    expect(store.get(REST_ENDS_AT_KEY)).toBeDefined();
  });

  it('schedules a system notification when notify is enabled', async () => {
    // Arrange
    const timer = useRestTimerStore();

    // Act
    await timer.startRest(60, { notify: true, vibrate: false });

    // Assert
    const expectedAt = new Date('2026-07-12T10:01:00Z').getTime();
    expect(scheduleMock).toHaveBeenCalledWith(expectedAt, { vibrate: false });
  });

  it('does not schedule a notification when notify is disabled', async () => {
    // Arrange
    const timer = useRestTimerStore();

    // Act
    await timer.startRest(60, { notify: false, vibrate: true });

    // Assert
    expect(scheduleMock).not.toHaveBeenCalled();
    expect(cancelMock).toHaveBeenCalled();
  });

  it('counts down as time passes', async () => {
    // Arrange
    const timer = useRestTimerStore();
    await timer.startRest(90, { notify: false, vibrate: false });

    // Act
    vi.advanceTimersByTime(10_000);

    // Assert
    expect(timer.remaining).toBe(80);
  });

  it('vibrates and clears when it reaches zero without a system notification', async () => {
    // Arrange
    const timer = useRestTimerStore();
    await timer.startRest(5, { notify: false, vibrate: true });

    // Act
    await vi.advanceTimersByTimeAsync(5_000);

    // Assert
    expect(vibrateMock).toHaveBeenCalledOnce();
    expect(timer.running).toBe(false);
    expect(store.get(REST_ENDS_AT_KEY)).toBeUndefined();
  });

  it('does not vibrate in-app when a system notification will fire', async () => {
    // Arrange
    const timer = useRestTimerStore();
    await timer.startRest(5, { notify: true, vibrate: true });

    // Act
    await vi.advanceTimersByTimeAsync(5_000);

    // Assert
    expect(vibrateMock).not.toHaveBeenCalled();
    expect(timer.running).toBe(false);
  });

  it('stops the rest, clears storage and cancels the notification', async () => {
    // Arrange
    const timer = useRestTimerStore();
    await timer.startRest(90, { notify: true, vibrate: true });
    cancelMock.mockClear();

    // Act
    await timer.stopRest();

    // Assert
    expect(timer.running).toBe(false);
    expect(store.get(REST_ENDS_AT_KEY)).toBeUndefined();
    expect(cancelMock).toHaveBeenCalledOnce();
  });

  it('persists and restores the chosen corner', async () => {
    // Arrange
    const timer = useRestTimerStore();

    // Act
    await timer.setCorner('top-right');

    // Assert
    expect(store.get(REST_CORNER_KEY)).toBe('top-right');
  });

  it('rehydrates a still-running rest from storage', async () => {
    // Arrange
    const future = new Date('2026-07-12T10:00:00Z').getTime() + 40_000;
    store.set(REST_ENDS_AT_KEY, JSON.stringify({ endsAt: future, notify: true, vibrate: false }));
    store.set(REST_CORNER_KEY, 'bottom-right');
    const timer = useRestTimerStore();

    // Act
    await timer.rehydrate();

    // Assert
    expect(timer.running).toBe(true);
    expect(timer.remaining).toBe(40);
    expect(timer.corner).toBe('bottom-right');
  });

  it('discards an expired rest on rehydrate', async () => {
    // Arrange
    const past = new Date('2026-07-12T10:00:00Z').getTime() - 5_000;
    store.set(REST_ENDS_AT_KEY, JSON.stringify({ endsAt: past, notify: true, vibrate: true }));
    const timer = useRestTimerStore();

    // Act
    await timer.rehydrate();

    // Assert
    expect(timer.running).toBe(false);
    expect(store.get(REST_ENDS_AT_KEY)).toBeUndefined();
  });
});
