import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoutineStore } from '../../stores/routine.store';
import { useWorkoutStore } from '../../stores/workout.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';
import { summarizePerformance } from '../../use-cases/exerciseHistory';
import { resolveWeightUnit } from '../../use-cases/resolveWeightUnit';
import { dayLabelEs } from 'src/core/utils/relativeTime';
import type { ExerciseSet } from '../../types/training.types';
import { useSetLogging } from '../../composables/useSetLogging';

export function useExerciseDetailPage() {
  const route = useRoute();
  const router = useRouter();
  const routineStore = useRoutineStore();
  const workoutStore = useWorkoutStore();
  const profileStore = useProfileStore();

  const { current, currentExercises } = storeToRefs(routineStore);
  const { history } = storeToRefs(workoutStore);
  const { profile } = storeToRefs(profileStore);
  const { showSetDialog, setDefaults, openSetDialog, logSetWithRest } = useSetLogging();

  const routineId = computed(() => route.params.id as string);
  const pivotId = computed(() => route.params.pivotId as string);

  const view = computed(() =>
    currentExercises.value.find((item) => item.pivotId === pivotId.value),
  );
  const exerciseName = computed(() => view.value?.exercise.name ?? '');
  const routineName = computed(() => current.value?.name ?? '');

  const weightUnit = computed(() =>
    resolveWeightUnit(view.value?.exercise, profile.value?.unitSystem),
  );

  const performance = computed(() => summarizePerformance(history.value));

  const groups = computed(() =>
    history.value.map((group) => ({ ...group, label: dayLabelEs(group.date, new Date()) })),
  );

  function openSet(set: ExerciseSet): void {
    void router.push(`/entreno/series/${set.id}/editar`);
  }

  async function onAddSet(): Promise<void> {
    await openSetDialog(pivotId.value);
  }

  async function onSubmitSet(payload: { reps: number; weight: number }): Promise<void> {
    await logSetWithRest(routineId.value, pivotId.value, view.value?.exercise, payload);
    await workoutStore.loadHistory(pivotId.value);
  }

  function goToEdit(): void {
    const exerciseId = view.value?.exercise.id;
    if (exerciseId) {
      void router.push(`/entreno/ejercicios/${exerciseId}/editar`);
    }
  }

  onMounted(async () => {
    try {
      await routineStore.loadDetail(routineId.value);
      await workoutStore.loadHistory(pivotId.value);
    } catch {
      void router.replace('/entreno');
    }
  });

  return {
    exerciseName,
    routineName,
    weightUnit,
    performance,
    groups,
    showSetDialog,
    setDefaults,
    openSet,
    onAddSet,
    onSubmitSet,
    goToEdit,
  };
}
