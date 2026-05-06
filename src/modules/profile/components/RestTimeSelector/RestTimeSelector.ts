import { ref, computed, watch } from 'vue';
import { REST_TIME_PRESETS } from '../../types/profile.types';
import type { RestTimePreset } from '../../types/profile.types';

export function useRestTimeSelector(
  emit: (e: 'update:modelValue', value: number | null) => void,
) {
  const selectedPreset = ref<RestTimePreset | null>(90);
  const customRestTime = ref<number | null>(null);

  const restTime = computed<number | null>(() => {
    if (selectedPreset.value !== null) return selectedPreset.value;
    if (customRestTime.value && customRestTime.value > 0) return customRestTime.value;
    return null;
  });

  watch(restTime, (value) => emit('update:modelValue', value), { immediate: true });

  function selectPreset(preset: RestTimePreset) {
    selectedPreset.value = preset;
    customRestTime.value = null;
  }

  function onCustomInput(value: string | number | null) {
    if (value && Number(value) > 0) {
      selectedPreset.value = null;
    }
  }

  return {
    selectedPreset,
    customRestTime,
    REST_TIME_PRESETS,
    selectPreset,
    onCustomInput,
  };
}
