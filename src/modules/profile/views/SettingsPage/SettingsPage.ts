import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useProfileStore } from '../../stores/profile.store';
import { useFormValidation } from '../../composables/useFormValidation';
import type { OnboardingForm } from '../../types/profile.types';

export function useSettingsPage() {
  const $q = useQuasar();
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

  const isValid = computed(
    () =>
      form.value.name.trim().length > 0 &&
      restTime.value !== null &&
      isPositive(form.value.maintenanceCalories) &&
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
        maintenanceCalories: form.value.maintenanceCalories,
        weight: form.value.weight,
        height: form.value.height,
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
        maintenanceCalories: profile.maintenanceCalories,
        weight: profile.weight,
        height: profile.height,
      };
      restTime.value = profile.defaultRestTime;
    }
  });

  return { form, restTime, submitted, saving, weightSuffix, heightSuffix, isPositive, save };
}
