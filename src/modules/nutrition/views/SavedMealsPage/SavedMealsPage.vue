<template>
  <q-page class="q-pa-md">
    <div class="column q-gutter-y-md page-content">
      <q-input v-model="searchModel" dense outlined placeholder="Buscar comida">
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn
        unelevated
        color="primary"
        size="lg"
        no-caps
        icon="add"
        label="Nueva comida guardada"
        class="full-width"
        @click="addNew"
      />

      <div v-if="visibleItems.length" class="column q-gutter-y-sm">
        <SavedMealListItem
          v-for="meal in visibleItems"
          :key="meal.id"
          :meal="meal"
          @open="openMeal(meal.id)"
        />
      </div>
      <div v-else class="empty-box text-muted">No hay comidas guardadas. Crea la primera.</div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import SavedMealListItem from '../../components/SavedMealListItem/SavedMealListItem.vue';
import { useSavedMealsPage } from './SavedMealsPage';

const { visibleItems, searchModel, addNew, openMeal } = useSavedMealsPage();
</script>
