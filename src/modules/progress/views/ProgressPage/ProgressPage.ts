import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useProgressStore } from '../../stores/progress.store';
import { PROGRESS_RANGES, type ProgressRange } from '../../types/progress.types';

export function useProgressPage() {
  const store = useProgressStore();
  const { summary, range, filters } = storeToRefs(store);

  onMounted(() => {
    void store.load();
  });

  const rangeOptions = PROGRESS_RANGES.map((value) => ({ label: value, value }));

  const currentWeightLabel = computed(() => {
    const weight = summary.value.metrics.currentWeight;
    return weight != null ? String(weight) : '—';
  });

  const weightDeltaLabel = computed(() => {
    const delta = summary.value.metrics.weightDelta;
    if (delta == null) return '';
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta} kg`;
  });

  function onRange(value: ProgressRange): void {
    store.setRange(value);
  }

  return {
    summary,
    range,
    filters,
    rangeOptions,
    currentWeightLabel,
    weightDeltaLabel,
    onRange,
    setRoutine: store.setRoutine,
    setType: store.setType,
  };
}
