import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useRoutineStore } from '../../stores/routine.store';
import { useWorkoutStore } from '../../stores/workout.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';
import { relativeTimeEs, isWithinLast24h } from 'src/core/utils/relativeTime';
import type { RoutineExerciseView } from '../../types/training.types';

const DEFAULT_REST_SECONDS = 90;

export function useRoutineDetailPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const routineStore = useRoutineStore();
  const workoutStore = useWorkoutStore();
  const profileStore = useProfileStore();

  const { current, currentExercises, currentInProgress } = storeToRefs(routineStore);
  const { lastSets, restRemaining, restRunning } = storeToRefs(workoutStore);
  const { profile } = storeToRefs(profileStore);

  const routineId = computed(() => route.params.id as string);
  const query = ref('');

  const showSetDialog = ref(false);
  const activeExercise = ref<RoutineExerciseView | null>(null);
  const activeDefaults = ref<{ reps: number; weight: number }>({ reps: 0, weight: 0 });

  const visibleExercises = computed(() => {
    const normalized = query.value.trim().toLowerCase();
    if (!normalized) return currentExercises.value;
    return currentExercises.value.filter((view) =>
      view.exercise.name.toLowerCase().includes(normalized),
    );
  });

  function captionFor(pivotId: string): string {
    const last = lastSets.value[pivotId];
    if (!last) return '';
    return `${last.weight ?? 0} kg · ${last.reps ?? 0} reps`;
  }

  function statusLabelFor(pivotId: string): string {
    const last = lastSets.value[pivotId];
    return last ? relativeTimeEs(last.createdAt, new Date()) : '';
  }

  function statusColorFor(pivotId: string): string {
    const last = lastSets.value[pivotId];
    return last && isWithinLast24h(last.createdAt, new Date()) ? 'positive' : 'negative';
  }

  const activeExerciseName = computed(() => activeExercise.value?.exercise.name ?? '');

  const restLabel = computed(() => {
    const total = Math.max(restRemaining.value, 0);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  async function onSwipeSet(
    view: RoutineExerciseView,
    details: { reset: () => void },
  ): Promise<void> {
    details.reset();
    activeExercise.value = view;
    activeDefaults.value = await workoutStore.lastSetDefaults(view.pivotId);
    showSetDialog.value = true;
  }

  function onSwipeDelete(view: RoutineExerciseView, details: { reset: () => void }): void {
    details.reset();
    $q.dialog({
      title: 'Eliminar ejercicio',
      message: `¿Quitar "${view.exercise.name}" de esta rutina?`,
      cancel: { flat: true, noCaps: true, label: 'Cancelar' },
      ok: { unelevated: true, noCaps: true, color: 'negative', label: 'Eliminar' },
      dark: true,
    }).onOk(() => {
      void routineStore.removeExercise(view.pivotId);
    });
  }

  async function onSubmitSet(payload: { reps: number; weight: number }): Promise<void> {
    const view = activeExercise.value;
    if (!view) return;
    await workoutStore.logExerciseSet(routineId.value, view.pivotId, payload);
    const restSeconds =
      view.exercise.restTime ?? profile.value?.defaultRestTime ?? DEFAULT_REST_SECONDS;
    workoutStore.startRest(restSeconds);
    showSetDialog.value = false;
  }

  function goToEdit(): void {
    void router.push(`/entreno/rutinas/${routineId.value}/editar`);
  }

  function onOpenExercise(pivotId: string): void {
    void router.push(`/entreno/rutinas/${routineId.value}/ejercicio/${pivotId}`);
  }

  onMounted(async () => {
    try {
      await routineStore.loadDetail(routineId.value);
      await workoutStore.loadLastSets();
    } catch {
      void router.replace('/entreno');
    }
  });

  return {
    current,
    currentInProgress,
    visibleExercises,
    query,
    showSetDialog,
    activeExerciseName,
    activeDefaults,
    restRunning,
    restLabel,
    captionFor,
    statusLabelFor,
    statusColorFor,
    onSwipeSet,
    onSwipeDelete,
    onSubmitSet,
    onOpenExercise,
    stopRest: workoutStore.stopRest,
    goToEdit,
  };
}
