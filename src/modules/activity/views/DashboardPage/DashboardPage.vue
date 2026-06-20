<template>
  <q-page class="dashboard-page q-pa-md">
    <div class="dashboard-page__content">
      <div>
        <div class="text-caption text-uppercase text-primary text-weight-bold">{{ todayLabel }}</div>
        <div class="text-h5 text-weight-bolder">{{ greeting }}</div>
      </div>

      <template v-if="summary">
        <NutritionSummaryCard :summary="summary.nutrition" />

        <div class="text-subtitle1 text-weight-bold">Último entrenamiento</div>
        <LastWorkoutCard v-if="summary.lastWorkout" :workout="summary.lastWorkout" />

        <div class="dashboard-page__stats">
          <StatCard
            label="Frecuencia semanal"
            :value="summary.weeklyStats.workoutFrequency"
            unit="veces"
            action-icon="add"
          />
          <StatCard label="Peso medio" :value="weightValue" :unit="weightUnit" />
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

<style scoped lang="scss" src="./DashboardPage.scss"></style>
