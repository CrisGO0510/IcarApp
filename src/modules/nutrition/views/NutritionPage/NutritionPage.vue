<template>
  <q-page class="q-pa-md">
    <Teleport defer to="#toolbar-action">
      <q-btn flat dense no-caps color="primary" label="Editar" @click="goToEdit" />
    </Teleport>

    <div class="column q-gutter-y-md page-content">
      <div class="text-micro text-uppercase text-muted">Resumen de hoy</div>

      <q-card flat class="app-card">
        <div class="row items-center justify-between no-wrap q-mb-md">
          <div>
            <div class="text-micro text-uppercase text-muted">Calorías actuales</div>
            <div class="text-display">{{ caloriesLabel }}</div>
          </div>
          <q-icon name="local_fire_department" color="primary" size="32px" />
        </div>

        <div v-if="day" class="row q-col-gutter-md">
          <div class="col-4">
            <div class="text-micro text-uppercase text-muted q-mb-xs">Proteína</div>
            <q-linear-progress
              :value="macroRatio(day.protein)"
              color="primary"
              track-color="dark"
              rounded
              size="6px"
              class="q-mb-xs"
            />
            <div class="text-small text-muted">{{ macroLabel(day.protein) }}</div>
          </div>
          <div class="col-4">
            <div class="text-micro text-uppercase text-muted q-mb-xs">Carbos</div>
            <q-linear-progress
              :value="macroRatio(day.carbohydrates)"
              color="primary"
              track-color="dark"
              rounded
              size="6px"
              class="q-mb-xs"
            />
            <div class="text-small text-muted">{{ macroLabel(day.carbohydrates) }}</div>
          </div>
          <div class="col-4">
            <div class="text-micro text-uppercase text-muted q-mb-xs">Grasas</div>
            <q-linear-progress
              :value="macroRatio(day.fat)"
              color="primary"
              track-color="dark"
              rounded
              size="6px"
              class="q-mb-xs"
            />
            <div class="text-small text-muted">{{ macroLabel(day.fat) }}</div>
          </div>
        </div>
      </q-card>

      <q-expansion-item
        default-opened
        label="Comidas registradas"
        header-class="text-h2-section text-strong q-px-none"
      >
        <div class="column q-gutter-y-sm q-pt-sm">
          <MealCard
            v-for="meal in meals"
            :key="meal.id"
            :meal="meal"
            @open="openMeal(meal)"
          />
          <div v-if="!meals.length" class="text-center text-muted q-pa-md">
            Aún no registras comidas hoy.
          </div>
          <q-btn
            outline
            color="primary"
            no-caps
            icon="add"
            label="Añadir otra comida"
            class="full-width q-mt-xs"
            @click="addMeal"
          />
        </div>
      </q-expansion-item>

      <q-expansion-item
        label="Actividad"
        header-class="text-h2-section text-strong q-px-none"
      >
        <div class="column q-gutter-y-sm q-pt-sm">
          <div class="surface-card text-center text-faint">No hay actividades registradas hoy</div>
          <q-btn
            unelevated
            color="primary"
            no-caps
            icon="add"
            label="Añadir actividad"
            class="full-width"
            @click="addActivity"
          />
        </div>
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import MealCard from '../../components/MealCard/MealCard.vue';
import { useNutritionPage } from './NutritionPage';

const { day, meals, caloriesLabel, macroRatio, macroLabel, goToEdit, addMeal, openMeal, addActivity } =
  useNutritionPage();
</script>
