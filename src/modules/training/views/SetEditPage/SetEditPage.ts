import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { date as dateUtil, useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import { useWorkoutStore } from '../../stores/workout.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';
import { resolveWeightUnit } from '../../use-cases/resolveWeightUnit';
import type { WeightUnit } from '../../types/training.types';
import { useConfirmDialog } from 'src/composables/useConfirmDialog';

const DATE_MASK = 'DD/MM/YYYY';
const TIME_MASK = 'HH:mm';
const DATETIME_MASK = `${DATE_MASK} ${TIME_MASK}`;

export function useSetEditPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const store = useWorkoutStore();
  const profileStore = useProfileStore();
  const { profile } = storeToRefs(profileStore);
  const { confirmDestructive } = useConfirmDialog();

  const setId = computed(() => route.params.setId as string);

  const exerciseName = ref('');
  const reps = ref(0);
  const weight = ref(0);
  const notes = ref('');
  const dateValue = ref('');
  const timeValue = ref('');
  const exerciseWeightUnit = ref<WeightUnit | undefined>(undefined);

  const weightUnit = computed(() =>
    resolveWeightUnit(
      exerciseWeightUnit.value ? { weightUnit: exerciseWeightUnit.value } : null,
      profile.value?.unitSystem,
    ),
  );

  async function save(): Promise<void> {
    if (!dateValue.value || !timeValue.value) return;
    const performedAt = dateUtil.extractDate(
      `${dateValue.value} ${timeValue.value}`,
      DATETIME_MASK,
    );
    try {
      await store.editSet(setId.value, {
        reps: Math.max(0, reps.value || 0),
        weight: Math.max(0, weight.value || 0),
        notes: notes.value,
        performedAt,
      });
      router.back();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo guardar la serie.',
      });
    }
  }

  function remove(): void {
    confirmDestructive({
      title: 'Eliminar serie',
      message: 'Esta acción es irreversible. ¿Eliminar la serie?',
      onConfirm: () => {
        void store
          .removeSet(setId.value)
          .then(() => router.back())
          .catch((error: unknown) => {
            $q.notify({
              type: 'negative',
              message: error instanceof Error ? error.message : 'No se pudo eliminar la serie.',
            });
          });
      },
    });
  }

  onMounted(async () => {
    try {
      const detail = await store.setDetail(setId.value);
      exerciseName.value = detail.exerciseName;
      exerciseWeightUnit.value = detail.weightUnit;
      reps.value = detail.set.reps ?? 0;
      weight.value = detail.set.weight ?? 0;
      notes.value = detail.set.notes ?? '';
      dateValue.value = dateUtil.formatDate(detail.set.createdAt, DATE_MASK);
      timeValue.value = dateUtil.formatDate(detail.set.createdAt, TIME_MASK);
    } catch {
      $q.notify({ type: 'negative', message: 'No se encontró la serie.' });
      void router.replace('/entreno');
    }
  });

  return {
    exerciseName,
    weightUnit,
    reps,
    weight,
    notes,
    dateValue,
    timeValue,
    dateMask: DATE_MASK,
    timeMask: TIME_MASK,
    save,
    remove,
  };
}
