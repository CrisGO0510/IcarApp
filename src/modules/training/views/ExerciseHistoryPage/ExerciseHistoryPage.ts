import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useExerciseStore } from '../../stores/exercise.store';
import { useWorkoutStore } from '../../stores/workout.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';
import { summarizePerformance } from '../../use-cases/exerciseHistory';
import { resolveWeightUnit } from '../../use-cases/resolveWeightUnit';
import { dayLabelEs } from 'src/core/utils/relativeTime';
import type { ExerciseSet } from '../../types/training.types';

export function useExerciseHistoryPage() {
  const route = useRoute();
  const router = useRouter();
  const exerciseStore = useExerciseStore();
  const workoutStore = useWorkoutStore();
  const profileStore = useProfileStore();

  const { exercises } = storeToRefs(exerciseStore);
  const { history } = storeToRefs(workoutStore);
  const { profile } = storeToRefs(profileStore);

  const exerciseId = computed(() => route.params.id as string);

  const exercise = computed(() => exercises.value.find((e) => e.id === exerciseId.value) ?? null);

  const exerciseName = computed(() => exercise.value?.name ?? '');

  const weightUnit = computed(() =>
    resolveWeightUnit(exercise.value, profile.value?.unitSystem),
  );

  const performance = computed(() => summarizePerformance(history.value));

  const groups = computed(() =>
    history.value.map((group) => ({ ...group, label: dayLabelEs(group.date, new Date()) })),
  );

  function goToEdit(): void {
    void router.push(`/entreno/ejercicios/${exerciseId.value}/editar`);
  }

  function openSet(set: ExerciseSet): void {
    void router.push(`/entreno/series/${set.id}/editar`);
  }

  onMounted(async () => {
    try {
      await exerciseStore.load();
      await workoutStore.loadHistoryByExerciseId(exerciseId.value);
    } catch {
      void router.replace('/entreno');
    }
  });

  return { exerciseName, weightUnit, performance, groups, goToEdit, openSet };
}
