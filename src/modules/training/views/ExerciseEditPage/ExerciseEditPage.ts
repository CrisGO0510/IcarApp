import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useExerciseStore } from '../../stores/exercise.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';
import { useConfirmDialog } from 'src/composables/useConfirmDialog';
import { resolveWeightUnit } from '../../use-cases/resolveWeightUnit';
import { WEIGHT_UNITS, type WeightUnit } from '../../types/training.types';

const DEFAULT_REST_SECONDS = 90;

const WEIGHT_UNIT_OPTIONS = WEIGHT_UNITS.map((unit) => ({ label: unit, value: unit }));

export function useExerciseEditPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const store = useExerciseStore();
  const profileStore = useProfileStore();
  const { exercises } = storeToRefs(store);
  const { profile } = storeToRefs(profileStore);
  const { confirmDestructive } = useConfirmDialog();

  const id = computed(() => route.params.id as string);
  const name = ref('');
  const useDefault = ref(true);
  const minutes = ref(0);
  const seconds = ref(0);
  const weightUnit = ref<WeightUnit>('kg');

  function applyExercise(): void {
    const exercise = exercises.value.find((item) => item.id === id.value);
    if (!exercise) {
      void router.replace('/entreno/ejercicios');
      return;
    }
    name.value = exercise.name;
    const restTime =
      exercise.restTime ?? profile.value?.defaultRestTime ?? DEFAULT_REST_SECONDS;
    useDefault.value = exercise.restTime == null;
    minutes.value = Math.floor(restTime / 60);
    seconds.value = restTime % 60;
    weightUnit.value = resolveWeightUnit(exercise, profile.value?.unitSystem);
  }

  async function save(): Promise<void> {
    if (!name.value.trim()) {
      $q.notify({ type: 'negative', message: 'El nombre del ejercicio es obligatorio.' });
      return;
    }
    const restTime = useDefault.value ? null : minutes.value * 60 + seconds.value;
    try {
      await store.update(id.value, name.value, restTime, weightUnit.value);
      router.back();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo guardar el ejercicio.',
      });
    }
  }

  function remove(): void {
    confirmDestructive({
      title: 'Eliminar ejercicio',
      message: `¿Eliminar "${name.value}"? Se quitará también de las rutinas que lo usen.`,
      onConfirm: () => {
        void store.deleteById(id.value).then(() => router.back());
      },
    });
  }

  onMounted(async () => {
    await store.load();
    applyExercise();
  });

  return {
    name,
    useDefault,
    minutes,
    seconds,
    weightUnit,
    weightUnitOptions: WEIGHT_UNIT_OPTIONS,
    save,
    remove,
  };
}
