import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useRoutineStore } from '../../stores/routine.store';
import type { RoutineSortMode, RoutineSummary } from '../../types/training.types';
import { ROUTINE_SORT_MODE } from '../../types/training.types';
import { useConfirmDialog } from 'src/composables/useConfirmDialog';

const SORT_OPTIONS: ReadonlyArray<{ label: string; value: RoutineSortMode }> = [
  { label: 'Reciente', value: ROUTINE_SORT_MODE.RECENT },
  { label: 'A-Z', value: ROUTINE_SORT_MODE.ALPHABETICAL },
];

export function useRoutinesListPage() {
  const router = useRouter();
  const store = useRoutineStore();
  const { sortedSummaries } = storeToRefs(store);
  const { confirmDestructive } = useConfirmDialog();

  const sortMode = computed({
    get: () => store.sortMode,
    set: (mode: RoutineSortMode) => {
      void store.setSortMode(mode);
    },
  });

  function goToLibrary(): void {
    void router.push('/entreno/ejercicios');
  }

  function goToNew(): void {
    void router.push('/entreno/rutinas/nueva');
  }

  function openRoutine(summary: RoutineSummary): void {
    void router.push(`/entreno/rutinas/${summary.routine.id}`);
  }

  function editRoutine(summary: RoutineSummary): void {
    void router.push(`/entreno/rutinas/${summary.routine.id}/editar`);
  }

  function deleteRoutine(summary: RoutineSummary): void {
    confirmDestructive({
      title: 'Eliminar rutina',
      message: `¿Eliminar "${summary.routine.name}"? Esta acción no se puede deshacer.`,
      onConfirm: () => {
        void store.remove(summary.routine.id);
      },
    });
  }

  onMounted(() => {
    void store.loadList();
  });

  return {
    sortedSummaries,
    sortMode,
    sortOptions: SORT_OPTIONS,
    goToLibrary,
    goToNew,
    openRoutine,
    editRoutine,
    deleteRoutine,
  };
}
