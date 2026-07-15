import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  configureHardwareBackButton,
  EXIT_CONFIRMATION_MESSAGE,
  EXIT_CONFIRMATION_TIMEOUT_MS,
} from './hardwareBackButton';

const { exitAppMock, isNativePlatformMock, notifyCreateMock } = vi.hoisted(() => ({
  exitAppMock: vi.fn(),
  isNativePlatformMock: vi.fn(),
  notifyCreateMock: vi.fn(),
}));

vi.mock('@capacitor/app', () => ({
  App: { exitApp: exitAppMock },
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: { isNativePlatform: isNativePlatformMock },
}));

vi.mock('quasar', () => ({
  Notify: { create: notifyCreateMock },
}));

type NavigatorWithApp = Navigator & { app?: { exitApp: () => void } };

const getNavigator = (): NavigatorWithApp => navigator;

const pressBackAtRoot = () => {
  getNavigator().app?.exitApp();
};

describe('configureHardwareBackButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    isNativePlatformMock.mockReturnValue(true);
    vi.stubGlobal('navigator', { app: { exitApp: vi.fn() } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('does not touch the navigator shim on web', () => {
    // Arrange
    isNativePlatformMock.mockReturnValue(false);
    const originalExitApp = getNavigator().app?.exitApp;

    // Act
    configureHardwareBackButton();

    // Assert
    expect(getNavigator().app?.exitApp).toBe(originalExitApp);
  });

  it('replaces the navigator exitApp shim on native platforms', () => {
    // Arrange
    const originalExitApp = getNavigator().app?.exitApp;

    // Act
    configureHardwareBackButton();

    // Assert
    expect(getNavigator().app?.exitApp).not.toBe(originalExitApp);
  });

  it('shows the exit confirmation instead of exiting on the first press', () => {
    // Arrange
    configureHardwareBackButton();

    // Act
    pressBackAtRoot();

    // Assert
    expect(exitAppMock).not.toHaveBeenCalled();
    expect(notifyCreateMock).toHaveBeenCalledOnce();
    expect(notifyCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({ message: EXIT_CONFIRMATION_MESSAGE }),
    );
  });

  it('exits the app on the second press within the confirmation window', () => {
    // Arrange
    configureHardwareBackButton();
    pressBackAtRoot();

    // Act
    vi.advanceTimersByTime(EXIT_CONFIRMATION_TIMEOUT_MS - 1);
    pressBackAtRoot();

    // Assert
    expect(exitAppMock).toHaveBeenCalledOnce();
  });

  it('asks for confirmation again when the window has expired', () => {
    // Arrange
    configureHardwareBackButton();
    pressBackAtRoot();

    // Act
    vi.advanceTimersByTime(EXIT_CONFIRMATION_TIMEOUT_MS);
    pressBackAtRoot();

    // Assert
    expect(exitAppMock).not.toHaveBeenCalled();
    expect(notifyCreateMock).toHaveBeenCalledTimes(2);
  });

  it('creates the navigator shim when it does not exist yet', () => {
    // Arrange
    vi.stubGlobal('navigator', {});

    // Act
    configureHardwareBackButton();
    pressBackAtRoot();

    // Assert
    expect(notifyCreateMock).toHaveBeenCalledOnce();
  });

  it('keeps the confirmation even if the native bridge reassigns exitApp afterwards', () => {
    // Arrange
    configureHardwareBackButton();
    const nativeShim = vi.fn();
    getNavigator().app!.exitApp = nativeShim;

    // Act
    pressBackAtRoot();

    // Assert
    expect(nativeShim).not.toHaveBeenCalled();
    expect(exitAppMock).not.toHaveBeenCalled();
    expect(notifyCreateMock).toHaveBeenCalledOnce();
  });
});
