import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useExerciseStore } from '../../stores/exercise.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';

const DEFAULT_REST_SECONDS = 90;

export function useExerciseEditPage() {
  const route = useRoute();
  const router = useRouter();
  const $q = useQuasar();
  const store = useExerciseStore();
  const profileStore = useProfileStore();
  const { exercises } = storeToRefs(store);
  const { profile } = storeToRefs(profileStore);

  const id = computed(() => route.params.id as string);
  const name = ref('');
  const useDefault = ref(true);
  const minutes = ref(0);
  const seconds = ref(0);

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
  }

  async function save(): Promise<void> {
    if (!name.value.trim()) {
      $q.notify({ type: 'negative', message: 'El nombre del ejercicio es obligatorio.' });
      return;
    }
    const restTime = useDefault.value ? null : minutes.value * 60 + seconds.value;
    try {
      await store.update(id.value, name.value, restTime);
      router.back();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo guardar el ejercicio.',
      });
    }
  }

  function remove(): void {
    $q.dialog({
      title: 'Eliminar ejercicio',
      message: `¿Eliminar "${name.value}"? Se quitará también de las rutinas que lo usen.`,
      cancel: { flat: true, noCaps: true, label: 'Cancelar' },
      ok: { unelevated: true, noCaps: true, color: 'negative', label: 'Eliminar' },
      dark: true,
    }).onOk(() => {
      void store.deleteById(id.value).then(() => router.back());
    });
  }

  onMounted(async () => {
    await store.load();
    applyExercise();
  });

  return { name, useDefault, minutes, seconds, save, remove };
}
