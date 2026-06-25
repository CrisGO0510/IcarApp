import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoutineStore } from '../../stores/routine.store';
import { useWorkoutStore } from '../../stores/workout.store';
import { summarizePerformance } from '../../use-cases/exerciseHistory';
import { dayLabelEs } from 'src/core/utils/relativeTime';

export function useExerciseDetailPage() {
  const route = useRoute();
  const router = useRouter();
  const routineStore = useRoutineStore();
  const workoutStore = useWorkoutStore();

  const { current, currentExercises } = storeToRefs(routineStore);
  const { history } = storeToRefs(workoutStore);

  const routineId = computed(() => route.params.id as string);
  const pivotId = computed(() => route.params.pivotId as string);

  const view = computed(() =>
    currentExercises.value.find((item) => item.pivotId === pivotId.value),
  );
  const exerciseName = computed(() => view.value?.exercise.name ?? '');
  const routineName = computed(() => current.value?.name ?? '');

  const performance = computed(() => summarizePerformance(history.value));

  const groups = computed(() =>
    history.value.map((group) => ({ ...group, label: dayLabelEs(group.date, new Date()) })),
  );

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

  return { exerciseName, routineName, performance, groups, goToEdit };
}
