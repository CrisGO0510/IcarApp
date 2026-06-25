<template>
  <div class="app-card cursor-pointer" role="button" tabindex="0" @click="emit('open')">
    <div class="row items-start justify-between no-wrap">
      <div class="row items-center no-wrap">
        <span class="status-dot" :class="dotClass" />
        <div class="q-ml-sm">
          <div class="text-subtitle1 text-weight-bold">{{ summary.routine.name }}</div>
          <div class="row items-center q-gutter-x-xs text-caption text-muted">
            <q-icon name="schedule" size="14px" />
            <span>{{ performedLabel }}</span>
          </div>
        </div>
      </div>
      <q-btn flat round dense size="sm" icon="more_vert" @click.stop>
        <q-menu>
          <q-list dense style="min-width: 140px">
            <q-item v-close-popup clickable @click="emit('edit')">
              <q-item-section>Editar</q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="emit('delete')">
              <q-item-section class="text-negative">Eliminar</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <div
      v-if="summary.inProgress"
      class="row items-center q-gutter-x-xs text-caption text-primary q-mt-xs"
    >
      <q-icon name="pending" size="14px" />
      <span>En progreso</span>
    </div>

    <div class="row q-gutter-x-sm q-mt-sm">
      <q-chip
        v-if="summary.durationMinutes"
        dense
        square
        color="dark"
        text-color="white"
        icon="schedule"
      >
        {{ summary.durationMinutes }} min
      </q-chip>
      <q-chip dense square color="dark" text-color="white" icon="fitness_center">
        {{ summary.exerciseCount }} ejercicios
      </q-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RoutineSummary } from '../../types/training.types';
import { relativeTimeEs, isWithinLast24h } from 'src/core/utils/relativeTime';

const props = defineProps<{ summary: RoutineSummary }>();

const emit = defineEmits<{ open: []; edit: []; delete: [] }>();

const performedLabel = computed(() => {
  const at = props.summary.lastPerformedAt;
  return at ? `Realizada ${relativeTimeEs(at, new Date())}` : 'Sin registros';
});

const dotClass = computed(() => {
  const at = props.summary.lastPerformedAt;
  if (props.summary.inProgress) return 'bg-primary';
  if (!at) return 'bg-grey-7';
  return isWithinLast24h(at, new Date()) ? 'bg-positive' : 'bg-negative';
});
</script>
