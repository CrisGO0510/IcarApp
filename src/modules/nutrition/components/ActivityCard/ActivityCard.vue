<template>
  <q-card flat class="app-card cursor-pointer" @click="emit('open')">
    <div class="row items-start justify-between no-wrap">
      <div class="text-small text-primary text-weight-bold">{{ activity.durationMinutes }} min</div>
      <div class="text-right">
        <span class="text-numeric">{{ activity.caloriesBurned }}</span>
        <span class="text-micro text-faint q-ml-xs">KCAL</span>
      </div>
    </div>
    <div class="text-h2-section q-mt-xs">{{ activity.type }}</div>
  </q-card>
</template>

<script setup lang="ts">
import type { ActivityEntry } from '../../types/nutrition.types';

defineProps<{ activity: ActivityEntry }>();
const emit = defineEmits<{ open: [] }>();
</script>
