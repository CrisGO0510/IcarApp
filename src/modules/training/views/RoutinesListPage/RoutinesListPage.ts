import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useRoutineStore } from '../../stores/routine.store';
import type { RoutineSummary } from '../../types/training.types';
import { useConfirmDialog } from 'src/composables/useConfirmDialog';

export function useRoutinesListPage() {
  const router = useRouter();
  const store = useRoutineStore();
  const { summaries } = storeToRefs(store);
  const { confirmDestructive } = useConfirmDialog();

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

  return { summaries, goToLibrary, goToNew, openRoutine, editRoutine, deleteRoutine };
}
