import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '../../stores/profile.store';
import { useFormValidation } from '../../composables/useFormValidation';
import type { OnboardingForm } from '../../types/profile.types';

export function useOnboardingPage() {
  const router = useRouter();
  const profileStore = useProfileStore();
  const { submitted, isPositive, markSubmitted } = useFormValidation();

  const form = ref<OnboardingForm>({
    name: '',
    unitSystem: 'metric',
    maintenanceCalories: 0,
    weight: 0,
    height: 0,
  });

  const restTime = ref<number | null>(90);
  const saving = ref(false);

  const weightSuffix = computed(() => (form.value.unitSystem === 'metric' ? 'kg' : 'lbs'));
  const heightSuffix = computed(() => (form.value.unitSystem === 'metric' ? 'cm' : 'in'));

  const isValid = computed(() => {
    return (
      form.value.name.trim().length > 0 &&
      restTime.value !== null &&
      isPositive(form.value.maintenanceCalories) &&
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
        maintenanceCalories: form.value.maintenanceCalories,
        weight: form.value.weight,
        height: form.value.height,
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
  };
}
