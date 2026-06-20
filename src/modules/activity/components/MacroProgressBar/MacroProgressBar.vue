<template>
  <div class="macro-progress-bar">
    <div class="row items-center justify-between q-mb-xs">
      <span class="text-caption text-uppercase text-muted">{{ label }}</span>
      <span class="text-body2 text-weight-medium" :class="{ 'text-muted': !hasGoal }">
        {{ valueLabel }}
      </span>
    </div>
    <q-linear-progress
      v-if="hasGoal"
      :value="ratio"
      :color="isOver ? 'warning' : 'primary'"
      track-color="grey-9"
      rounded
      size="8px"
    />
    <div v-else class="text-caption text-faint">Sin objetivo definido</div>
  </div>
</template>

<script setup lang="ts">
import type { MacroProgress } from '../../types/activity.types';
import { useMacroProgressBar } from './MacroProgressBar';

const props = defineProps<{
  label: string;
  progress: MacroProgress;
  unit: string;
}>();

const { hasGoal, ratio, isOver, valueLabel } = useMacroProgressBar(props);
</script>
