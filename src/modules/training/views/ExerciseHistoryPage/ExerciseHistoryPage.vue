<template>
  <q-page class="q-pa-md">
    <Teleport defer to="#toolbar-action">
      <q-btn flat dense no-caps color="primary" label="Editar" @click="goToEdit" />
    </Teleport>

    <div class="column q-gutter-y-md page-content">
      <div class="text-h6 text-weight-bold">{{ exerciseName }}</div>

      <q-card flat class="app-card">
        <div class="row items-center justify-between q-mb-md">
          <span class="text-caption text-uppercase text-primary text-weight-bold">Rendimiento</span>
          <span class="pill-badge">vs última sesión</span>
        </div>
        <div class="row q-col-gutter-xs">
          <div v-for="stat in stats" :key="stat.label" class="col-4">
            <div class="stat-box column items-center text-center">
              <q-icon :name="stat.icon" class="stat-icon q-mb-xs" />
              <div class="text-caption text-uppercase text-muted q-mb-xs">{{ stat.label }}</div>
              <div class="text-h6 text-weight-bold q-mb-xs">{{ stat.value }}</div>
              <span v-if="stat.delta" class="text-caption text-weight-semibold" :class="stat.deltaClass">
                {{ stat.delta }}
              </span>
              <span v-else class="text-caption text-muted">—</span>
            </div>
          </div>
        </div>
      </q-card>

      <template v-if="groups.length">
        <q-card v-for="group in groups" :key="group.label" flat class="app-card">
          <div class="row items-center justify-between q-mb-sm">
            <span class="text-caption text-uppercase text-primary text-weight-bold">
              {{ group.label }}
            </span>
            <span class="text-caption text-muted">{{ group.totalSets }} series</span>
          </div>
          <div
            v-for="set in group.sets"
            :key="set.id"
            class="row items-center justify-between q-py-xs cursor-pointer"
            role="button"
            tabindex="0"
            @click="openSet(set)"
          >
            <div class="row items-center q-gutter-x-sm no-wrap">
              <span class="icon-tile icon-tile--sm text-caption text-weight-bold">
                {{ set.setNumber }}
              </span>
              <div class="column">
                <span class="text-weight-medium">{{ set.weight ?? 0 }} kg</span>
                <span v-if="set.notes" class="text-caption text-faint">{{ set.notes }}</span>
              </div>
            </div>
            <span class="text-body2 text-muted">{{ set.reps ?? 0 }} reps</span>
          </div>
        </q-card>
      </template>
      <div v-else class="text-center text-muted q-pa-lg">
        Aún no has registrado series de este ejercicio.
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useExerciseHistoryPage } from './ExerciseHistoryPage';

const { exerciseName, performance, groups, goToEdit, openSet } = useExerciseHistoryPage();

function formatDelta(value: number | null, unit = ''): string {
  if (value == null || value === 0) return '';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}${unit}`;
}

function deltaClass(value: number | null): string {
  if (value == null || value === 0) return '';
  return value > 0 ? 'text-positive' : 'text-negative';
}

const stats = computed(() => [
  {
    label: 'Series',
    icon: 'layers',
    value: performance.value.series,
    delta: formatDelta(performance.value.seriesDelta),
    deltaClass: deltaClass(performance.value.seriesDelta),
  },
  {
    label: 'Reps',
    icon: 'fitness_center',
    value: performance.value.reps,
    delta: formatDelta(performance.value.repsDelta),
    deltaClass: deltaClass(performance.value.repsDelta),
  },
  {
    label: 'Volumen',
    icon: 'bar_chart',
    value: `${performance.value.volume} kg`,
    delta: formatDelta(performance.value.volumeDelta, ' kg'),
    deltaClass: deltaClass(performance.value.volumeDelta),
  },
]);
</script>
