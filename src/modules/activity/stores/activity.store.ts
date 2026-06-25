import { ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { DashboardSummary } from '../types/activity.types';
import { buildDashboardSummary } from '../use-cases/buildDashboardSummary';
import { dashboardMockInput } from './dashboard.mock';

function todayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useActivityStore = defineStore('activity', () => {
  const summary = ref<DashboardSummary | null>(null);

  function loadDashboard(): Promise<void> {
    summary.value = buildDashboardSummary(todayKey(), dashboardMockInput);
    return Promise.resolve();
  }

  return { summary, loadDashboard };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useActivityStore, import.meta.hot));
}
