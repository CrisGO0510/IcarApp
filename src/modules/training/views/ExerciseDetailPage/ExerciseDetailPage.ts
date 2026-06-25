import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useRoutineStore } from '../../stores/routine.store';
import { useWorkoutStore } from '../../stores/workout.store';
import { summarizePerformance } from '../../use-cases/exerciseHistory';
import { dayLabelEs } from 'src/core/utils/relativeTime';
import type { ExerciseSet } from '../../types/training.types';

export function useExerciseDetailPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
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

  const showSetDialog = ref(false);
  const activeSet = ref<ExerciseSet | null>(null);

  function openSet(set: ExerciseSet): void {
    activeSet.value = set;
    showSetDialog.value = true;
  }

  async function onSaveSet(payload: { reps: number; weight: number; notes: string }): Promise<void> {
    if (!activeSet.value) return;
    await workoutStore.editSet(pivotId.value, activeSet.value.id, payload);
    showSetDialog.value = false;
  }

  function onRemoveSet(): void {
    const set = activeSet.value;
    if (!set) return;
    $q.dialog({
      title: 'Eliminar serie',
      message: 'Esta acción es irreversible. ¿Eliminar la serie?',
      cancel: { flat: true, noCaps: true, label: 'Cancelar' },
      ok: { unelevated: true, noCaps: true, color: 'negative', label: 'Eliminar' },
      dark: true,
    }).onOk(() => {
      void workoutStore.removeSet(pivotId.value, set.id).then(() => {
        showSetDialog.value = false;
      });
    });
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
    performance,
    groups,
    showSetDialog,
    activeSet,
    openSet,
    onSaveSet,
    onRemoveSet,
    goToEdit,
  };
}
