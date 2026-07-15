import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

const REST_NOTIFICATION_ID = 1001;
const CHANNEL_VIBRATE = 'rest-done-vibrate';
const CHANNEL_SILENT = 'rest-done-silent';
const SILENT_SOUND = 'silence';
const MAX_IMPORTANCE = 5;

let permissionGranted = false;
let channelsReady = false;

async function ensureReady(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;

  if (!permissionGranted) {
    const status = await LocalNotifications.checkPermissions();
    if (status.display !== 'granted') {
      const requested = await LocalNotifications.requestPermissions();
      if (requested.display !== 'granted') return false;
    }
    permissionGranted = true;
  }

  if (!channelsReady) {
    await LocalNotifications.createChannel({
      id: CHANNEL_VIBRATE,
      name: 'Descanso (vibración)',
      importance: MAX_IMPORTANCE,
      vibration: true,
      sound: SILENT_SOUND,
    });
    await LocalNotifications.createChannel({
      id: CHANNEL_SILENT,
      name: 'Descanso',
      importance: MAX_IMPORTANCE,
      vibration: false,
      sound: SILENT_SOUND,
    });
    channelsReady = true;
  }

  return true;
}

export async function scheduleRestReminder(atMs: number, opts: { vibrate: boolean }): Promise<void> {
  if (!(await ensureReady())) return;
  await LocalNotifications.cancel({ notifications: [{ id: REST_NOTIFICATION_ID }] });
  await LocalNotifications.schedule({
    notifications: [
      {
        id: REST_NOTIFICATION_ID,
        title: 'Descanso terminado',
        body: 'Es hora de tu siguiente serie.',
        channelId: opts.vibrate ? CHANNEL_VIBRATE : CHANNEL_SILENT,
        schedule: { at: new Date(atMs), allowWhileIdle: true },
      },
    ],
  });
}

export async function cancelRestReminder(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await LocalNotifications.cancel({ notifications: [{ id: REST_NOTIFICATION_ID }] });
}

export async function ensureNotificationPermission(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.requestPermissions();
  } catch {
    /* el usuario puede conceder permisos luego desde ajustes del sistema */
  }
}
