<template>
  <q-page class="q-pa-md">
    <div class="column q-gutter-y-md page-content">
      <q-btn-toggle
        :model-value="range"
        :options="rangeOptions"
        spread
        no-caps
        unelevated
        rounded
        color="dark"
        toggle-color="primary"
        text-color="text-muted"
        @update:model-value="onRange"
      />

      <ProgressMetricCard
        icon="monitor_weight"
        label="Peso actual"
        :value="currentWeightLabel"
        unit="kg"
        :delta="weightDeltaLabel"
      />

      <ProgressMetricCard
        icon="event_available"
        label="Asistencias totales"
        :value="summary.metrics.totalAttendance"
      />

      <q-card flat class="app-card">
        <div class="text-subtitle1 text-weight-bold">Progresión de Peso</div>
        <div class="text-caption text-muted q-mb-sm">{{ summary.weightProgression.subtitle }}</div>
        <WeightProgressionChart :points="summary.weightProgression.points" />
      </q-card>

      <q-card flat class="app-card">
        <div class="row items-start justify-between no-wrap q-mb-xs">
          <div>
            <div class="text-subtitle1 text-weight-bold">Volumen de Entrenamiento</div>
            <div class="text-caption text-muted">Volumen total por sesión</div>
          </div>
          <div class="column q-gutter-y-xs items-end">
            <q-select
              :model-value="filters.routine"
              :options="summary.volumeOptions.routines"
              dense
              options-dense
              borderless
              dropdown-icon="expand_more"
              class="volume-filter"
              @update:model-value="setRoutine"
            />
            <q-select
              :model-value="filters.type"
              :options="summary.volumeOptions.types"
              dense
              options-dense
              borderless
              dropdown-icon="expand_more"
              class="volume-filter"
              @update:model-value="setType"
            />
          </div>
        </div>
        <TrainingVolumeChart :points="summary.volume" />
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ProgressMetricCard from '../../components/ProgressMetricCard/ProgressMetricCard.vue';
import WeightProgressionChart from '../../components/WeightProgressionChart/WeightProgressionChart.vue';
import TrainingVolumeChart from '../../components/TrainingVolumeChart/TrainingVolumeChart.vue';
import { useProgressPage } from './ProgressPage';

const {
  summary,
  range,
  filters,
  rangeOptions,
  currentWeightLabel,
  weightDeltaLabel,
  onRange,
  setRoutine,
  setType,
} = useProgressPage();
</script>

<style scoped lang="scss">
.volume-filter {
  min-width: 110px;
}
</style>
