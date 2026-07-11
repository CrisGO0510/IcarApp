import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateUuid } from './uuid';

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const nativeGetRandomValues = crypto.getRandomValues.bind(crypto);

describe('generateUuid', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('delegates to crypto.randomUUID when available', () => {
    // Arrange
    const native = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    vi.stubGlobal('crypto', { ...crypto, randomUUID: () => native });

    // Act
    const result = generateUuid();

    // Assert
    expect(result).toBe(native);
  });

  it('generates a v4 uuid without crypto.randomUUID', () => {
    // Arrange
    vi.stubGlobal('crypto', { getRandomValues: nativeGetRandomValues });

    // Act
    const result = generateUuid();

    // Assert
    expect(result).toMatch(UUID_V4_PATTERN);
  });

  it('generates unique values without crypto.randomUUID', () => {
    // Arrange
    vi.stubGlobal('crypto', { getRandomValues: nativeGetRandomValues });

    // Act
    const first = generateUuid();
    const second = generateUuid();

    // Assert
    expect(first).not.toBe(second);
  });
});
