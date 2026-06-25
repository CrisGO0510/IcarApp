<template>
  <q-card flat class="app-card cursor-pointer" @click="emit('open')">
    <div class="row items-start justify-between no-wrap">
      <div class="text-small text-primary text-weight-bold">{{ timeLabel }}</div>
      <div class="text-right">
        <span class="text-numeric">{{ meal.calories }}</span>
        <span class="text-micro text-faint q-ml-xs">KCAL</span>
      </div>
    </div>
    <div class="text-h2-section q-mt-xs">{{ meal.foodName }}</div>
    <div class="row items-center q-gutter-md q-mt-sm text-small text-muted">
      <span class="status-dot bg-primary" />
      <span>P: <b class="text-strong">{{ meal.protein }}g</b></span>
      <span>C: <b class="text-strong">{{ meal.carbohydrates }}g</b></span>
      <span>G: <b class="text-strong">{{ meal.fat }}g</b></span>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MealEntry } from '../../types/nutrition.types';

const props = defineProps<{ meal: MealEntry }>();
const emit = defineEmits<{ open: [] }>();

const timeLabel = computed(() =>
  props.meal.loggedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
);
</script>
