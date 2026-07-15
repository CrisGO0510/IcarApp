<template>
  <q-page class="q-pa-md">
    <Teleport defer to="#toolbar-action">
      <q-btn flat dense no-caps color="primary" label="Editar" @click="goToEdit" />
    </Teleport>

    <div class="column q-gutter-y-md page-content">
      <div class="row items-center justify-between no-wrap">
        <q-btn
          flat
          dense
          round
          icon="chevron_left"
          aria-label="Día anterior"
          @click="previousDay"
        />
        <div class="text-h2-section cursor-pointer" role="button" tabindex="0">
          {{ dateLabel }}
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="dateProxy" no-unset :options="dateOptions" />
          </q-popup-proxy>
        </div>
        <q-btn
          flat
          dense
          round
          icon="chevron_right"
          aria-label="Día siguiente"
          :disable="isToday"
          @click="nextDay"
        />
      </div>

      <div>
        <div class="text-micro text-uppercase text-muted q-mb-sm">Resumen de hoy</div>
        <q-card flat class="app-card">
          <div class="row items-center justify-between no-wrap q-mb-md">
            <div>
              <div class="text-micro text-uppercase text-muted">Calorías actuales</div>
              <div class="text-display">{{ caloriesLabel }}</div>
            </div>
            <div class="calorie-ring">
              <q-icon name="local_fire_department" color="primary" size="24px" />
            </div>
          </div>

          <div v-if="remainingLabel !== null" class="text-small text-muted q-mb-md">
            Quemadas: {{ burnedLabel }} kcal · Restantes: {{ remainingLabel }} kcal
          </div>

          <div v-if="day" class="row q-col-gutter-md">
            <div class="col-4">
              <div class="text-micro text-uppercase text-muted q-mb-xs">Proteína</div>
              <q-linear-progress
                :value="macroRatio(day.protein)"
                color="primary"
                track-color="surface-variant"
                rounded
                size="8px"
                class="q-mb-xs"
              />
              <div class="text-small text-muted">
                <span class="text-strong text-weight-bold">{{ day.protein.consumed }}</span
                >{{ macroGoalSuffix(day.protein) }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-micro text-uppercase text-muted q-mb-xs">Carbos</div>
              <q-linear-progress
                :value="macroRatio(day.carbohydrates)"
                color="primary"
                track-color="surface-variant"
                rounded
                size="8px"
                class="q-mb-xs"
              />
              <div class="text-small text-muted">
                <span class="text-strong text-weight-bold">{{ day.carbohydrates.consumed }}</span
                >{{ macroGoalSuffix(day.carbohydrates) }}
              </div>
            </div>
            <div class="col-4">
              <div class="text-micro text-uppercase text-muted q-mb-xs">Grasas</div>
              <q-linear-progress
                :value="macroRatio(day.fat)"
                color="primary"
                track-color="surface-variant"
                rounded
                size="8px"
                class="q-mb-xs"
              />
              <div class="text-small text-muted">
                <span class="text-strong text-weight-bold">{{ day.fat.consumed }}</span
                >{{ macroGoalSuffix(day.fat) }}
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <q-expansion-item
        default-opened
        label="Comidas registradas"
        header-class="text-h2-section text-strong q-px-none"
      >
        <div class="column q-gutter-y-sm q-pt-sm">
          <q-btn
            outline
            color="primary"
            no-caps
            icon="add"
            label="Añadir otra comida"
            class="full-width"
            @click="addMeal"
          />
          <MealCard v-for="meal in meals" :key="meal.id" :meal="meal" @open="openMeal(meal)" />
          <div v-if="!meals.length" class="empty-box text-muted">
            Sin comidas registradas este día
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item label="Actividad" header-class="text-h2-section text-strong q-px-none">
        <div class="column q-gutter-y-sm q-pt-sm">
          <q-btn
            outline
            color="primary"
            no-caps
            icon="add"
            label="Añadir actividad"
            class="full-width"
            @click="addActivity"
          />
          <ActivityCard
            v-for="activity in activities"
            :key="activity.id"
            :activity="activity"
            @open="openActivity(activity)"
          />
          <div v-if="!activities.length" class="empty-box text-muted">
            Sin actividades registradas este día
          </div>
          <div v-else class="text-small text-muted text-right">
            Total quemado: {{ burnedLabel }} kcal
          </div>
        </div>
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import MealCard from '../../components/MealCard/MealCard.vue';
import ActivityCard from '../../components/ActivityCard/ActivityCard.vue';
import { useNutritionPage } from './NutritionPage';

const {
  day,
  meals,
  activities,
  caloriesLabel,
  burnedLabel,
  remainingLabel,
  macroRatio,
  macroGoalSuffix,
  goToEdit,
  addMeal,
  openMeal,
  addActivity,
  openActivity,
  dateLabel,
  dateProxy,
  dateOptions,
  isToday,
  previousDay,
  nextDay,
} = useNutritionPage();
</script>
