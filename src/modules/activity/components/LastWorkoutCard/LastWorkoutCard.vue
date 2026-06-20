<template>
  <q-card flat class="app-card">
    <div class="row items-start justify-between no-wrap">
      <div>
        <q-badge outline color="primary" :label="tag" class="q-mb-sm" />
        <div class="text-h6 text-weight-bolder">{{ workout.routineName }}</div>
      </div>
      <q-avatar size="36px" color="primary" text-color="dark" icon="fitness_center" />
    </div>

    <div class="row q-gutter-md q-my-sm text-muted">
      <div class="row items-center q-gutter-xs">
        <q-icon name="schedule" size="16px" />
        <span class="text-body2">{{ workout.durationMinutes }} min</span>
      </div>
      <div class="row items-center q-gutter-xs">
        <q-icon name="fitness_center" size="16px" />
        <span class="text-body2">{{ exerciseCount }} Ejercicios</span>
      </div>
    </div>

    <q-separator dark spaced />

    <div
      v-for="exercise in workout.exercises"
      :key="exercise.name"
      class="row items-center justify-between q-py-xs"
    >
      <span class="text-body2 text-weight-medium">{{ exercise.name }}</span>
      <span class="text-body2 text-muted">{{ exercise.sets }} sets</span>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import type { LastWorkout } from '../../types/activity.types';
import { useLastWorkoutCard } from './LastWorkoutCard';

const props = defineProps<{ workout: LastWorkout }>();

const { tag, exerciseCount } = useLastWorkoutCard(props);
</script>
