import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { ALL_FILTER, type ProgressRange, type VolumeFilters } from '../types/progress.types';
import { buildProgressSummary } from '../use-cases/buildProgressSummary';
import { progressMockInput } from './progress.mock';

export const useProgressStore = defineStore('progress', () => {
  const now = new Date();
  const range = ref<ProgressRange>('1M');
  const filters = ref<VolumeFilters>({ routine: ALL_FILTER, type: ALL_FILTER });

  const summary = computed(() =>
    buildProgressSummary(progressMockInput, range.value, filters.value, now),
  );

  function setRange(value: ProgressRange): void {
    range.value = value;
  }

  function setRoutine(routine: string): void {
    filters.value = { ...filters.value, routine };
  }

  function setType(type: string): void {
    filters.value = { ...filters.value, type };
  }

  return { range, filters, summary, setRange, setRoutine, setType };
});
