import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoutineStore } from '../../stores/routine.store';
import { useWorkoutStore } from '../../stores/workout.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';
import { relativeTimeEs, isWithinLast24h } from 'src/core/utils/relativeTime';
import type { RoutineExerciseView } from '../../types/training.types';
import { resolveWeightUnit } from '../../use-cases/resolveWeightUnit';
import { useConfirmDialog } from 'src/composables/useConfirmDialog';
import { useSwipeSides, SWIPE_SIDES } from 'src/composables/useSwipeSides';
import { useSetLogging } from '../../composables/useSetLogging';

export function useRoutineDetailPage() {
  const route = useRoute();
  const router = useRouter();
  const routineStore = useRoutineStore();
  const workoutStore = useWorkoutStore();
  const profileStore = useProfileStore();

  const { current, currentExercises, currentInProgress } = storeToRefs(routineStore);
  const { lastSets } = storeToRefs(workoutStore);
  const { profile } = storeToRefs(profileStore);
  const { confirmDestructive } = useConfirmDialog();
  const { showSetDialog, setDefaults, openSetDialog, logSetWithRest } = useSetLogging();
  const { primarySide, deleteSide } = useSwipeSides();

  const slideLeftColor = computed(() =>
    primarySide.value === SWIPE_SIDES.LEFT ? 'positive' : 'negative',
  );
  const slideRightColor = computed(() =>
    primarySide.value === SWIPE_SIDES.LEFT ? 'negative' : 'positive',
  );

  function swipeHandlersFor(
    view: RoutineExerciseView,
  ): Record<string, (details: { reset: () => void }) => void> {
    return {
      [primarySide.value]: (details) => {
        void onSwipeSet(view, details);
      },
      [deleteSide.value]: (details) => {
        onSwipeDelete(view, details);
      },
    };
  }

  const routineId = computed(() => route.params.id as string);
  const query = ref('');

  const activeExercise = ref<RoutineExerciseView | null>(null);

  const visibleExercises = computed(() => {
    const normalized = query.value.trim().toLowerCase();
    if (!normalized) return currentExercises.value;
    return currentExercises.value.filter((view) =>
      view.exercise.name.toLowerCase().includes(normalized),
    );
  });

  function captionFor(view: RoutineExerciseView): string {
    const last = lastSets.value[view.pivotId];
    if (!last) return '';
    const unit = resolveWeightUnit(view.exercise, profile.value?.unitSystem);
    return `${last.weight ?? 0} ${unit} · ${last.reps ?? 0} reps`;
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

  const activeWeightUnit = computed(() =>
    resolveWeightUnit(activeExercise.value?.exercise, profile.value?.unitSystem),
  );

  async function onSwipeSet(
    view: RoutineExerciseView,
    details: { reset: () => void },
  ): Promise<void> {
    details.reset();
    activeExercise.value = view;
    await openSetDialog(view.pivotId);
  }

  function onSwipeDelete(view: RoutineExerciseView, details: { reset: () => void }): void {
    details.reset();
    confirmDestructive({
      title: 'Eliminar ejercicio',
      message: `¿Quitar "${view.exercise.name}" de esta rutina?`,
      onConfirm: () => {
        void routineStore.removeExercise(view.pivotId);
      },
    });
  }

  async function onSubmitSet(payload: { reps: number; weight: number }): Promise<void> {
    const view = activeExercise.value;
    if (!view) return;
    await logSetWithRest(routineId.value, view.pivotId, view.exercise, payload);
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
    activeWeightUnit,
    activeDefaults: setDefaults,
    captionFor,
    statusLabelFor,
    statusColorFor,
    primarySide,
    deleteSide,
    slideLeftColor,
    slideRightColor,
    swipeHandlersFor,
    onSubmitSet,
    onOpenExercise,
    goToEdit,
  };
}
