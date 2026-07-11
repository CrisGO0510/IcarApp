<template>
  <q-card flat class="app-card">
    <div class="row items-center q-gutter-sm q-mb-md">
      <q-icon name="restaurant" color="primary" size="20px" />
      <span class="text-h2-section">Nutrición Diaria</span>
    </div>

    <div class="surface-card surface-card--bordered q-mb-md">
      <div class="row items-center justify-between no-wrap">
        <div>
          <div class="text-display">{{ caloriesLabel }}</div>
          <div class="text-caption text-uppercase text-muted">Calorías actuales</div>
        </div>
        <q-icon name="local_fire_department" color="primary" size="28px" />
      </div>
    </div>

    <div v-if="remainingLabel !== null" class="text-small text-muted q-mb-md">
      Quemadas: {{ burnedLabel }} kcal · Restantes: {{ remainingLabel }} kcal
    </div>

    <div v-if="hasGoals" class="column q-gutter-y-sm">
      <MacroProgressBar label="Proteína" :progress="summary.protein" unit="g" />
      <MacroProgressBar label="Carbohidratos" :progress="summary.carbohydrates" unit="g" />
      <MacroProgressBar label="Grasa" :progress="summary.fat" unit="g" />
    </div>
    <div v-else class="surface-card row items-center justify-between no-wrap">
      <div class="row items-center q-gutter-sm no-wrap">
        <q-icon name="info_outline" color="warning" size="20px" />
        <span class="text-small text-muted">No hay objetivos definidos.</span>
      </div>
      <q-btn
        flat
        dense
        no-caps
        color="primary"
        label="Definir"
        aria-label="Definir objetivos de macros"
        @click="goToGoals"
      />
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import MacroProgressBar from '../MacroProgressBar/MacroProgressBar.vue';
import type { DailyNutritionSummary } from '../../types/activity.types';

const props = defineProps<{ summary: DailyNutritionSummary }>();

const router = useRouter();

const hasGoals = computed(() =>
  [props.summary.protein, props.summary.carbohydrates, props.summary.fat].some(
    (macro) => macro.goal !== null,
  ),
);

function goToGoals(): void {
  void router.push('/nutricion/macros');
}

const caloriesLabel = computed(() => props.summary.calories.consumed.toLocaleString('en-US'));
const burnedLabel = computed(() => props.summary.burned.toLocaleString('en-US'));
const remainingLabel = computed(() =>
  props.summary.calories.remaining === null
    ? null
    : props.summary.calories.remaining.toLocaleString('en-US'),
);
</script>
