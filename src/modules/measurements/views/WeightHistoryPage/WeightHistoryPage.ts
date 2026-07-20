import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import { useMeasurementsStore } from '../../stores/measurements.store';
import type { BodyWeightLog } from '../../types/measurements.types';
import { dayLabelEs } from 'src/core/utils/relativeTime';
import { parseDateKey, todayKey } from 'src/core/utils/dateKey';
import { useConfirmDialog } from 'src/composables/useConfirmDialog';
import { useSwipeSides } from 'src/composables/useSwipeSides';

const NEW_ENTRY_TITLE = 'Registrar peso';
const EDIT_ENTRY_TITLE = 'Editar peso';

export function useWeightHistoryPage() {
  const $q = useQuasar();
  const store = useMeasurementsStore();
  const { logs, latest } = storeToRefs(store);
  const { confirmDestructive } = useConfirmDialog();
  const { singleDeleteSide } = useSwipeSides();

  const showDialog = ref(false);
  const editing = ref<BodyWeightLog | null>(null);

  const entries = computed(() => [...logs.value].reverse());
  const dialogTitle = computed(() => (editing.value ? EDIT_ENTRY_TITLE : NEW_ENTRY_TITLE));
  const dialogWeight = computed(() =>
    editing.value ? editing.value.weightKg : (latest.value?.weightKg ?? null),
  );

  function dayLabel(entry: BodyWeightLog): string {
    return dayLabelEs(parseDateKey(entry.date), new Date());
  }

  function dateLabel(entry: BodyWeightLog): string {
    return parseDateKey(entry.date).toLocaleDateString('es', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  function openNew(): void {
    editing.value = null;
    showDialog.value = true;
  }

  function openEdit(entry: BodyWeightLog): void {
    editing.value = entry;
    showDialog.value = true;
  }

  async function onSubmit(weightKg: number): Promise<void> {
    try {
      await store.log({ date: editing.value?.date ?? todayKey(), weightKg });
      showDialog.value = false;
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo guardar el peso.',
      });
    }
  }

  function onDelete(entry: BodyWeightLog): void {
    confirmDestructive({
      title: 'Eliminar peso',
      message: `Se eliminará el registro del ${dateLabel(entry)}. ¿Eliminar?`,
      onConfirm: () => {
        void store.remove(entry.id).catch((error: unknown) => {
          $q.notify({
            type: 'negative',
            message: error instanceof Error ? error.message : 'No se pudo eliminar el peso.',
          });
        });
      },
    });
  }

  onMounted(() => {
    void store.load();
  });

  return {
    entries,
    showDialog,
    singleDeleteSide,
    dialogTitle,
    dialogWeight,
    dayLabel,
    dateLabel,
    openNew,
    openEdit,
    onSubmit,
    onDelete,
  };
}
