import { ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { BodyWeightLog, WeightInput } from '../types/measurements.types';
import { BodyWeightLogJsonRepository } from '../repositories/body-weight.json-repository';
import { logWeight } from '../use-cases/logWeight';
import { listWeights } from '../use-cases/listWeights';
import { latestWeight } from '../use-cases/latestWeight';
import { deleteWeight } from '../use-cases/deleteWeight';

export const useMeasurementsStore = defineStore('measurements', () => {
  const repo = new BodyWeightLogJsonRepository();

  const _log = logWeight(repo);
  const _list = listWeights(repo);
  const _latest = latestWeight(repo);
  const _delete = deleteWeight(repo);

  const logs = ref<BodyWeightLog[]>([]);
  const latest = ref<BodyWeightLog | null>(null);

  async function load(): Promise<void> {
    logs.value = await _list();
    latest.value = await _latest();
  }

  async function log(input: WeightInput): Promise<void> {
    await _log(input);
    await load();
  }

  async function remove(id: string): Promise<void> {
    await _delete(id);
    await load();
  }

  return { logs, latest, load, log, remove };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMeasurementsStore, import.meta.hot));
}
