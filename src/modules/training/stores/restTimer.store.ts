import { ref, computed } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import { Preferences } from '@capacitor/preferences';
import { scheduleRestReminder, cancelRestReminder } from 'src/core/native/restNotifications';

export const REST_CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
export type RestCorner = (typeof REST_CORNERS)[number];

export const REST_ENDS_AT_KEY = 'icarapp:rest_ends_at';
export const REST_CORNER_KEY = 'icarapp:rest_corner';

const DEFAULT_CORNER: RestCorner = 'bottom-left';
const TICK_MS = 1000;
const VIBRATION_MS = 600;
const SECONDS_PER_MINUTE = 60;

interface StartOptions {
  notify: boolean;
  vibrate: boolean;
}

interface PersistedRest {
  endsAt: number;
  notify: boolean;
  vibrate: boolean;
}

export const useRestTimerStore = defineStore('restTimer', () => {
  const endsAt = ref<number | null>(null);
  const now = ref(Date.now());
  const corner = ref<RestCorner>(DEFAULT_CORNER);

  let notifyOnDone = false;
  let vibrateOnDone = false;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const remaining = computed(() => {
    if (endsAt.value === null) return 0;
    return Math.max(0, Math.ceil((endsAt.value - now.value) / 1000));
  });

  const running = computed(() => endsAt.value !== null && remaining.value > 0);

  const label = computed(() => {
    const total = remaining.value;
    const minutes = Math.floor(total / SECONDS_PER_MINUTE);
    const seconds = total % SECONDS_PER_MINUTE;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  function startTick(): void {
    if (intervalId !== null) return;
    intervalId = setInterval(() => {
      now.value = Date.now();
      if (endsAt.value !== null && now.value >= endsAt.value) {
        handleDone();
      }
    }, TICK_MS);
  }

  function stopTick(): void {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function vibrate(): void {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(VIBRATION_MS);
    }
  }

  function handleDone(): void {
    if (!notifyOnDone && vibrateOnDone) {
      vibrate();
    }
    endsAt.value = null;
    stopTick();
    void Preferences.remove({ key: REST_ENDS_AT_KEY });
  }

  async function startRest(seconds: number, opts: StartOptions): Promise<void> {
    const target = Date.now() + seconds * 1000;
    endsAt.value = target;
    now.value = Date.now();
    notifyOnDone = opts.notify;
    vibrateOnDone = opts.vibrate;

    await Preferences.set({
      key: REST_ENDS_AT_KEY,
      value: JSON.stringify({ endsAt: target, notify: opts.notify, vibrate: opts.vibrate }),
    });
    startTick();

    if (opts.notify) {
      await scheduleRestReminder(target, { vibrate: opts.vibrate });
    } else {
      await cancelRestReminder();
    }
  }

  async function stopRest(): Promise<void> {
    endsAt.value = null;
    stopTick();
    await Preferences.remove({ key: REST_ENDS_AT_KEY });
    await cancelRestReminder();
  }

  async function setCorner(next: RestCorner): Promise<void> {
    corner.value = next;
    await Preferences.set({ key: REST_CORNER_KEY, value: next });
  }

  async function rehydrate(): Promise<void> {
    const savedCorner = await Preferences.get({ key: REST_CORNER_KEY });
    if (savedCorner.value && (REST_CORNERS as readonly string[]).includes(savedCorner.value)) {
      corner.value = savedCorner.value as RestCorner;
    }

    const saved = await Preferences.get({ key: REST_ENDS_AT_KEY });
    if (!saved.value) return;

    let parsed: PersistedRest;
    try {
      parsed = JSON.parse(saved.value) as PersistedRest;
    } catch {
      await Preferences.remove({ key: REST_ENDS_AT_KEY });
      return;
    }

    now.value = Date.now();
    if (Number.isFinite(parsed.endsAt) && parsed.endsAt > now.value) {
      endsAt.value = parsed.endsAt;
      notifyOnDone = parsed.notify;
      vibrateOnDone = parsed.vibrate;
      startTick();
    } else {
      endsAt.value = null;
      await Preferences.remove({ key: REST_ENDS_AT_KEY });
    }
  }

  return {
    endsAt,
    corner,
    remaining,
    running,
    label,
    startRest,
    stopRest,
    setCorner,
    rehydrate,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRestTimerStore, import.meta.hot));
}
