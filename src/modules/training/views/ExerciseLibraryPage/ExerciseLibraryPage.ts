import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useExerciseStore } from '../../stores/exercise.store';
import { useSwipeSides } from 'src/composables/useSwipeSides';
import type { ExerciseSort } from '../../use-cases/exerciseQuery';

const SORT_OPTIONS: { value: ExerciseSort; label: string }[] = [
  { value: 'alpha', label: 'Alfabético' },
  { value: 'recent', label: 'Recientes' },
];

export function useExerciseLibraryPage() {
  const $q = useQuasar();
  const router = useRouter();
  const store = useExerciseStore();
  const { visibleExercises, sort } = storeToRefs(store);
  const { singleDeleteSide } = useSwipeSides();

  const showDialog = ref(false);

  const searchModel = computed({
    get: () => store.query,
    set: (value: string) => store.setQuery(value),
  });

  function openDialog(): void {
    showDialog.value = true;
  }

  async function onCreate(name: string): Promise<void> {
    try {
      await store.create(name);
      showDialog.value = false;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo crear el ejercicio.',
      });
    }
  }

  function selectSort(value: ExerciseSort): void {
    store.setSort(value);
  }

  function onDelete(id: string): void {
    void store.deleteById(id);
  }

  function onEdit(id: string): void {
    void router.push(`/entreno/ejercicios/${id}`);
  }

  onMounted(() => {
    void store.load();
  });

  return {
    visibleExercises,
    sort,
    singleDeleteSide,
    searchModel,
    showDialog,
    sortOptions: SORT_OPTIONS,
    openDialog,
    onCreate,
    selectSort,
    onDelete,
    onEdit,
  };
}
