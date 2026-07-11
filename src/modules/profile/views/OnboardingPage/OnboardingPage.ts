import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '../../stores/profile.store';
import { useFormValidation } from '../../composables/useFormValidation';
import { SEX_OPTIONS } from '../../types/profile.types';
import type { OnboardingForm } from '../../types/profile.types';
import { todayKey, DATE_KEY_MASK } from 'src/core/utils/dateKey';

export function useOnboardingPage() {
  const router = useRouter();
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

  const isValid = computed(() => {
    return (
      form.value.name.trim().length > 0 &&
      restTime.value !== null &&
      isPositive(form.value.weight) &&
      isPositive(form.value.height)
    );
  });

  async function handleSubmit() {
    markSubmitted();
    if (!isValid.value) return;

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
      await router.push('/');
    } finally {
      saving.value = false;
    }
  }

  return {
    form,
    restTime,
    submitted,
    saving,
    weightSuffix,
    heightSuffix,
    isPositive,
    handleSubmit,
    sexOptions: SEX_OPTIONS,
    dateOptions,
    dateKeyMask: DATE_KEY_MASK,
  };
}
