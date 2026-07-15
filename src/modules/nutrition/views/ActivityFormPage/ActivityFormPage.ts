import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useNutritionStore } from '../../stores/nutrition.store';
import { ACTIVITY_TYPES, DATE_QUERY_PARAM, OTHER_ACTIVITY_TYPE } from '../../types/nutrition.types';
import type { ActivityInput } from '../../types/nutrition.types';
import { useConfirmDialog } from 'src/composables/useConfirmDialog';

const ACTIVITY_NOT_FOUND_MESSAGE = 'No se encontró la actividad.';

export function useActivityFormPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const store = useNutritionStore();
  const { confirmDestructive } = useConfirmDialog();

  const activityId = computed(() => (route.params.id as string | undefined) ?? null);
  const isEdit = computed(() => activityId.value !== null);
  const queryDate = computed(() => (route.query[DATE_QUERY_PARAM] as string | undefined) ?? null);

  const selectedType = ref<string>(ACTIVITY_TYPES[0]);
  const customType = ref('');
  const caloriesBurned = ref<number>(0);
  const durationMinutes = ref<number>(0);

  const isOther = computed(() => selectedType.value === OTHER_ACTIVITY_TYPE);
  const typeOptions = [...ACTIVITY_TYPES];

  async function save(): Promise<void> {
    const input: ActivityInput = {
      date: isEdit.value
        ? (store.currentActivity?.date ?? store.date)
        : (queryDate.value ?? store.date),
      type: isOther.value ? customType.value : selectedType.value,
      caloriesBurned: caloriesBurned.value || 0,
      durationMinutes: durationMinutes.value || 0,
      loggedAt: isEdit.value ? (store.currentActivity?.loggedAt ?? new Date()) : new Date(),
    };

    try {
      if (isEdit.value && activityId.value) {
        await store.updateActivityEntry(activityId.value, input);
      } else {
        await store.logActivityEntry(input);
      }
      await router.push('/nutricion');
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo guardar la actividad.',
      });
    }
  }

  function remove(): void {
    const id = activityId.value;
    if (!id) return;
    confirmDestructive({
      title: 'Eliminar actividad',
      message: 'Esta acción es irreversible. ¿Eliminar la actividad?',
      onConfirm: () => {
        void store
          .removeActivity(id)
          .then(() => router.push('/nutricion'))
          .catch((error: unknown) => {
            $q.notify({
              type: 'negative',
              message: error instanceof Error ? error.message : 'No se pudo eliminar la actividad.',
            });
          });
      },
    });
  }

  function cancel(): void {
    void router.push('/nutricion');
  }

  onMounted(async () => {
    if (!isEdit.value || !activityId.value) return;
    try {
      await store.loadActivity(activityId.value);
      const activity = store.currentActivity;
      if (!activity) throw new Error(ACTIVITY_NOT_FOUND_MESSAGE);
      const isKnown = (ACTIVITY_TYPES as readonly string[]).includes(activity.type);
      selectedType.value = isKnown ? activity.type : OTHER_ACTIVITY_TYPE;
      customType.value = isKnown ? '' : activity.type;
      caloriesBurned.value = activity.caloriesBurned;
      durationMinutes.value = activity.durationMinutes;
    } catch {
      $q.notify({ type: 'negative', message: ACTIVITY_NOT_FOUND_MESSAGE });
      void router.replace('/nutricion');
    }
  });

  return {
    isEdit,
    selectedType,
    customType,
    isOther,
    typeOptions,
    caloriesBurned,
    durationMinutes,
    save,
    remove,
    cancel,
  };
}
