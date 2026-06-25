<template>
  <q-page class="dashboard-page q-pa-md">
    <div class="column q-gutter-y-md page-content">
      <div>
        <div class="text-caption text-uppercase text-primary text-weight-bold">{{ todayLabel }}</div>
        <div class="text-h1-page">{{ greeting }}</div>
      </div>

      <template v-if="summary">
        <NutritionSummaryCard :summary="summary.nutrition" />

        <div class="text-h2-section">Último entrenamiento</div>
        <LastWorkoutCard v-if="summary.lastWorkout" :workout="summary.lastWorkout" />

        <div class="row q-col-gutter-x-md">
          <div class="col-6">
            <StatCard
              class="full-height"
              label="Frecuencia semanal"
              :value="summary.weeklyStats.workoutFrequency"
              unit="veces"
            />
          </div>
          <div class="col-6">
            <StatCard
              class="full-height"
              label="Peso medio"
              :value="weightValue"
              :unit="weightUnit"
              action-icon="add"
            />
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import StatCard from 'src/components/base/StatCard/StatCard.vue';
import NutritionSummaryCard from '../../components/NutritionSummaryCard/NutritionSummaryCard.vue';
import LastWorkoutCard from '../../components/LastWorkoutCard/LastWorkoutCard.vue';
import { useDashboardPage } from './DashboardPage';

const { summary, greeting, todayLabel, weightValue, weightUnit } = useDashboardPage();
</script>
