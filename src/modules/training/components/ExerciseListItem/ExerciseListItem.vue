<template>
  <div class="app-card row items-center no-wrap">
    <div class="icon-tile">
      <q-icon name="fitness_center" color="primary" size="20px" />
    </div>
    <div class="col q-ml-md">
      <div class="text-weight-medium">{{ exercise.name }}</div>
      <div v-if="caption" class="text-caption text-muted">{{ caption }}</div>
    </div>
    <div v-if="statusLabel" class="row items-center no-wrap q-gutter-x-xs">
      <span class="status-dot" :class="`bg-${statusColor}`" />
      <span class="text-caption text-muted">{{ statusLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Exercise } from '../../types/training.types';

defineProps<{
  exercise: Exercise;
  caption?: string;
  statusLabel?: string;
  statusColor?: string;
}>();
</script>
