import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useProfileStore } from '../../stores/profile.store';
import { useFormValidation } from '../../composables/useFormValidation';
import { SEX_OPTIONS } from '../../types/profile.types';
import type { OnboardingForm } from '../../types/profile.types';
import { todayKey, DATE_KEY_MASK } from 'src/core/utils/dateKey';

export function useSettingsPage() {
  const $q = useQuasar();
  const profileStore = useProfileStore();
  const { submitted, isPositive, markSubmitted } = useFormValidation();

  const form = ref<OnboardingForm>({
    name: '',
    unitSystem: 'metric',
    weight: 0,
    height: 0,
    birthDate: '',
  });

  const todayLimit = todayKey().replaceAll('-', '/');

  function dateOptions(candidate: string): boolean {
    return candidate <= todayLimit;
  }

  const restTime = ref<number | null>(90);
  const saving = ref(false);

  const weightSuffix = computed(() => (form.value.unitSystem === 'metric' ? 'kg' : 'lbs'));
  const heightSuffix = computed(() => (form.value.unitSystem === 'metric' ? 'cm' : 'in'));

  const isValid = computed(
    () =>
      form.value.name.trim().length > 0 &&
      restTime.value !== null &&
      isPositive(form.value.weight) &&
      isPositive(form.value.height),
  );

  async function save(): Promise<void> {
    markSubmitted();
    if (!isValid.value) {
      $q.notify({ type: 'warning', message: 'Completa los campos requeridos.' });
      return;
    }

    saving.value = true;
    try {
      await profileStore.saveProfile({
        name: form.value.name.trim(),
        defaultRestTime: restTime.value!,
        unitSystem: form.value.unitSystem,
        weight: form.value.weight,
        height: form.value.height,
        ...(form.value.birthDate ? { birthDate: form.value.birthDate } : {}),
        ...(form.value.sex ? { sex: form.value.sex } : {}),
      });
      $q.notify({ type: 'positive', message: 'Perfil actualizado.' });
    } finally {
      saving.value = false;
    }
  }

  onMounted(async () => {
    await profileStore.loadProfile();
    const profile = profileStore.profile;
    if (profile) {
      form.value = {
        name: profile.name,
        unitSystem: profile.unitSystem,
        weight: profile.weight,
        height: profile.height,
        birthDate: profile.birthDate ?? '',
        ...(profile.sex ? { sex: profile.sex } : {}),
      };
      restTime.value = profile.defaultRestTime;
    }
  });

  return {
    form,
    restTime,
    submitted,
    saving,
    weightSuffix,
    heightSuffix,
    isPositive,
    save,
    sexOptions: SEX_OPTIONS,
    dateOptions,
    dateKeyMask: DATE_KEY_MASK,
  };
}
