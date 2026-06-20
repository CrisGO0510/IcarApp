<template>
  <q-card flat class="app-card">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-icon name="restaurant" color="primary" size="20px" />
      <span class="text-subtitle1 text-weight-bold">Nutrición Diaria</span>
    </div>

    <div class="calorie-highlight q-mb-md">
      <div class="row items-center justify-between no-wrap">
        <div>
          <div class="text-h4 text-weight-bolder">{{ caloriesLabel }}</div>
          <div class="text-caption text-uppercase text-muted">Calorías actuales</div>
        </div>
        <q-icon name="local_fire_department" color="primary" size="28px" />
      </div>
    </div>

    <div class="column q-gutter-y-sm">
      <MacroProgressBar label="Proteína" :progress="summary.protein" unit="g" />
      <MacroProgressBar label="Carbohidratos" :progress="summary.carbohydrates" unit="g" />
      <MacroProgressBar label="Grasa" :progress="summary.fat" unit="g" />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MacroProgressBar from '../MacroProgressBar/MacroProgressBar.vue';
import type { DailyNutritionSummary } from '../../types/activity.types';

const props = defineProps<{ summary: DailyNutritionSummary }>();

const caloriesLabel = computed(() => props.summary.calories.consumed.toLocaleString('en-US'));
</script>

<style scoped lang="scss">
.calorie-highlight {
  background: $surface-variant;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
}
</style>
