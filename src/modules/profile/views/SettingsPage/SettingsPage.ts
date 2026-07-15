import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useProfileStore } from '../../stores/profile.store';
import { useFormValidation } from '../../composables/useFormValidation';
import { SEX_OPTIONS } from '../../types/profile.types';
import type { OnboardingForm } from '../../types/profile.types';
import { todayKey, DATE_KEY_MASK } from 'src/core/utils/dateKey';
import { exportAllData, importAllData } from 'src/core/backup/dataBackup';
import { saveAndShareJson, pickJsonFile } from 'src/core/native/fileTransfer';
import { useConfirmDialog } from 'src/composables/useConfirmDialog';

const RELOAD_DELAY_MS = 800;

export function useSettingsPage() {
  const $q = useQuasar();
  const profileStore = useProfileStore();
  const { submitted, isPositive, markSubmitted } = useFormValidation();
  const { confirmDestructive } = useConfirmDialog();

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
  const restNotifications = ref(true);
  const restVibration = ref(true);
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
        restNotificationsEnabled: restNotifications.value,
        restVibrationEnabled: restVibration.value,
        ...(form.value.birthDate ? { birthDate: form.value.birthDate } : {}),
        ...(form.value.sex ? { sex: form.value.sex } : {}),
      });
      $q.notify({ type: 'positive', message: 'Perfil actualizado.' });
    } finally {
      saving.value = false;
    }
  }

  const transferring = ref(false);

  async function exportData(): Promise<void> {
    transferring.value = true;
    try {
      const json = await exportAllData(new Date());
      await saveAndShareJson(`icarapp-backup-${todayKey()}.json`, json);
    } catch {
      $q.notify({ type: 'negative', message: 'No se pudieron exportar los datos.' });
    } finally {
      transferring.value = false;
    }
  }

  async function importData(): Promise<void> {
    const raw = await pickJsonFile();
    if (!raw) return;

    confirmDestructive({
      title: 'Importar datos',
      message: 'Esto reemplazará TODOS tus datos actuales por los de la copia. ¿Continuar?',
      confirmLabel: 'Reemplazar',
      onConfirm: () => {
        void applyImport(raw);
      },
    });
  }

  async function applyImport(raw: string): Promise<void> {
    transferring.value = true;
    try {
      await importAllData(raw);
      $q.notify({ type: 'positive', message: 'Datos importados. Reiniciando…' });
      setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'El archivo no es válido.';
      $q.notify({ type: 'negative', message });
    } finally {
      transferring.value = false;
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
      restNotifications.value = profile.restNotificationsEnabled !== false;
      restVibration.value = profile.restVibrationEnabled !== false;
    }
  });

  return {
    form,
    restTime,
    restNotifications,
    restVibration,
    submitted,
    saving,
    transferring,
    exportData,
    importData,
    weightSuffix,
    heightSuffix,
    isPositive,
    save,
    sexOptions: SEX_OPTIONS,
    dateOptions,
    dateKeyMask: DATE_KEY_MASK,
  };
}
