import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import { useExerciseStore } from '../../stores/exercise.store';
import { useRoutineStore } from '../../stores/routine.store';
import { sortExercises, type ExerciseSort } from '../../use-cases/exerciseQuery';
import type { Exercise } from '../../types/training.types';

const LIBRARY_SORT_ICONS: Record<ExerciseSort, string> = {
  alpha: 'sort_by_alpha',
  recent: 'schedule',
};

export function useRoutineFormPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const exerciseStore = useExerciseStore();
  const routineStore = useRoutineStore();
  const { exercises } = storeToRefs(exerciseStore);

  const routineId = computed(() => (route.params.id as string | undefined) ?? null);
  const isEdit = computed(() => routineId.value !== null);

  const name = ref('');
  const selectedIds = ref<string[]>([]);
  const showExerciseDialog = ref(false);
  const librarySort = ref<ExerciseSort>('alpha');

  const selectedExercises = computed({
    get: () =>
      selectedIds.value
        .map((id) => exercises.value.find((exercise) => exercise.id === id))
        .filter((exercise): exercise is Exercise => Boolean(exercise)),
    set: (list: Exercise[]) => {
      selectedIds.value = list.map((exercise) => exercise.id);
    },
  });

  const libraryExercises = computed(() =>
    sortExercises(
      exercises.value.filter((exercise) => !selectedIds.value.includes(exercise.id)),
      librarySort.value,
    ),
  );

  const librarySortIcon = computed(() => LIBRARY_SORT_ICONS[librarySort.value]);

  function toggleLibrarySort(): void {
    librarySort.value = librarySort.value === 'alpha' ? 'recent' : 'alpha';
  }

  function isSelected(id: string): boolean {
    return selectedIds.value.includes(id);
  }

  function toggle(id: string): void {
    selectedIds.value = isSelected(id)
      ? selectedIds.value.filter((current) => current !== id)
      : [...selectedIds.value, id];
  }

  function openExerciseDialog(): void {
    showExerciseDialog.value = true;
  }

  async function onCreateExercise(name: string): Promise<void> {
    try {
      await exerciseStore.create(name);
      showExerciseDialog.value = false;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo crear el ejercicio.',
      });
    }
  }

  async function save(): Promise<void> {
    if (!name.value.trim()) {
      $q.notify({ type: 'negative', message: 'El nombre de la rutina es obligatorio.' });
      return;
    }

    const orderedIds = selectedExercises.value.map((exercise) => exercise.id);

    try {
      if (isEdit.value && routineId.value) {
        await routineStore.update(routineId.value, name.value, orderedIds);
      } else {
        await routineStore.create(name.value, orderedIds);
      }
      await router.push('/entreno');
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo guardar la rutina.',
      });
    }
  }

  onMounted(async () => {
    await exerciseStore.load();
    if (isEdit.value && routineId.value) {
      await routineStore.loadDetail(routineId.value);
      name.value = routineStore.current?.name ?? '';
      selectedIds.value = routineStore.currentExercises.map((view) => view.exercise.id);
    }
  });

  return {
    name,
    selectedExercises,
    libraryExercises,
    librarySortIcon,
    showExerciseDialog,
    toggle,
    toggleLibrarySort,
    openExerciseDialog,
    onCreateExercise,
    save,
  };
}
