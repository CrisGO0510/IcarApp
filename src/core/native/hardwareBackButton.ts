import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Notify } from 'quasar';

export const EXIT_CONFIRMATION_MESSAGE = 'Presiona de nuevo para salir';
export const EXIT_CONFIRMATION_TIMEOUT_MS = 2000;

type NavigatorWithApp = Navigator & { app?: { exitApp: () => void } };

export function configureHardwareBackButton(): void {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  let exitConfirmationPending = false;
  let exitConfirmationTimer: ReturnType<typeof setTimeout> | undefined;

  const requestExit = () => {
    if (exitConfirmationPending) {
      void App.exitApp();
      return;
    }

    exitConfirmationPending = true;
    Notify.create({
      message: EXIT_CONFIRMATION_MESSAGE,
      timeout: EXIT_CONFIRMATION_TIMEOUT_MS,
    });
    exitConfirmationTimer = setTimeout(() => {
      exitConfirmationPending = false;
      clearTimeout(exitConfirmationTimer);
    }, EXIT_CONFIRMATION_TIMEOUT_MS);
  };

  const nav = navigator as NavigatorWithApp;
  if (!nav.app) {
    nav.app = { exitApp: requestExit };
  }
  Object.defineProperty(nav.app, 'exitApp', {
    configurable: true,
    get: () => requestExit,
    set: () => undefined,
  });
}
