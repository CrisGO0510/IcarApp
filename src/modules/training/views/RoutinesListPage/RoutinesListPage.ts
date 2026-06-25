import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useRoutineStore } from '../../stores/routine.store';
import type { RoutineSummary } from '../../types/training.types';

export function useRoutinesListPage() {
  const router = useRouter();
  const $q = useQuasar();
  const store = useRoutineStore();
  const { summaries } = storeToRefs(store);

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
    $q.dialog({
      title: 'Eliminar rutina',
      message: `¿Eliminar "${summary.routine.name}"? Esta acción no se puede deshacer.`,
      cancel: { flat: true, noCaps: true, label: 'Cancelar' },
      ok: { unelevated: true, noCaps: true, color: 'negative', label: 'Eliminar' },
      dark: true,
    }).onOk(() => {
      void store.remove(summary.routine.id);
    });
  }

  onMounted(() => {
    void store.loadList();
  });

  return { summaries, goToLibrary, goToNew, openRoutine, editRoutine, deleteRoutine };
}
