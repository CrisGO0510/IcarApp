import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useWorkoutStore } from '../stores/workout.store';
import { useRestTimerStore } from '../stores/restTimer.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';
import type { Exercise } from '../types/training.types';
import type { SetInput } from '../use-cases/workoutSession';

const DEFAULT_REST_SECONDS = 90;

export function useSetLogging() {
  const workoutStore = useWorkoutStore();
  const restTimerStore = useRestTimerStore();
  const profileStore = useProfileStore();

  const { profile } = storeToRefs(profileStore);

  const showSetDialog = ref(false);
  const setDefaults = ref<{ reps: number; weight: number }>({ reps: 0, weight: 0 });

  async function openSetDialog(pivotId: string): Promise<void> {
    setDefaults.value = await workoutStore.lastSetDefaults(pivotId);
    showSetDialog.value = true;
  }

  async function logSetWithRest(
    routineId: string,
    pivotId: string,
    exercise: Exercise | undefined,
    payload: SetInput,
  ): Promise<void> {
    await workoutStore.logExerciseSet(routineId, pivotId, payload);
    const restSeconds =
      exercise?.restTime ?? profile.value?.defaultRestTime ?? DEFAULT_REST_SECONDS;
    await restTimerStore.startRest(restSeconds, {
      notify: profile.value?.restNotificationsEnabled !== false,
      vibrate: profile.value?.restVibrationEnabled !== false,
    });
    showSetDialog.value = false;
  }

  return {
    showSetDialog,
    setDefaults,
    openSetDialog,
    logSetWithRest,
  };
}
