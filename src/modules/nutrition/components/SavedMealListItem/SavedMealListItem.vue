<template>
  <q-card flat class="app-card cursor-pointer" @click="emit('open')">
    <div class="text-h2-section">{{ meal.name }}</div>
    <div class="text-small text-muted q-mt-xs">{{ unitLabel }}</div>
    <div class="row items-center q-gutter-x-sm q-mt-sm">
      <span class="macro-chip macro-chip--kcal">{{ meal.caloriesPerBase }} {{ ENERGY_UNIT }}</span>
      <span class="macro-chip macro-chip--protein">P {{ meal.proteinPerBase }}</span>
      <span class="macro-chip macro-chip--carbs">C {{ meal.carbohydratesPerBase }}</span>
      <span class="macro-chip macro-chip--fat">G {{ meal.fatPerBase }}</span>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  ENERGY_UNIT,
  MASS_UNIT,
  SAVED_MEAL_BASE_GRAMS,
  type SavedMeal,
} from '../../types/nutrition.types';

const props = defineProps<{ meal: SavedMeal }>();
const emit = defineEmits<{ open: [] }>();

const unitLabel = computed(() =>
  props.meal.unitGrams === null
    ? `Por ${SAVED_MEAL_BASE_GRAMS} ${MASS_UNIT}`
    : `Por ${SAVED_MEAL_BASE_GRAMS} ${MASS_UNIT} · 1 unidad = ${props.meal.unitGrams} ${MASS_UNIT}`,
);
</script>
