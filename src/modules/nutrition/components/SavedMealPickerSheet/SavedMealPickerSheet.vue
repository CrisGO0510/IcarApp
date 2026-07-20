<template>
  <q-dialog v-model="model" position="bottom">
    <q-card flat class="saved-meal-sheet">
      <q-input v-model="searchModel" dense outlined placeholder="Buscar en mis comidas">
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <div v-if="visibleItems.length" class="column q-gutter-y-sm q-mt-md saved-meal-sheet__list">
        <SavedMealListItem
          v-for="meal in visibleItems"
          :key="meal.id"
          :meal="meal"
          @open="select(meal)"
        />
      </div>
      <div v-else class="empty-box text-muted q-mt-md">
        No hay comidas guardadas. Créalas desde "Gestionar mis comidas" o al guardar una comida.
      </div>

      <q-btn
        flat
        no-caps
        color="primary"
        icon="settings"
        label="Gestionar mis comidas"
        class="full-width q-mt-sm"
        @click="goToLibrary"
      />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSavedMealStore } from '../../stores/savedMeal.store';
import { SAVED_MEALS_PATH, type SavedMeal } from '../../types/nutrition.types';
import SavedMealListItem from '../SavedMealListItem/SavedMealListItem.vue';

const model = defineModel<boolean>({ required: true });
const emit = defineEmits<{ select: [meal: SavedMeal] }>();

const router = useRouter();
const store = useSavedMealStore();
const { visibleItems, query } = storeToRefs(store);

const searchModel = computed({
  get: () => query.value,
  set: (value: string) => store.setQuery(value),
});

watch(model, (open) => {
  if (open) {
    store.setQuery('');
    void store.load();
  }
});

function select(meal: SavedMeal): void {
  model.value = false;
  emit('select', meal);
}

function goToLibrary(): void {
  model.value = false;
  void router.push(SAVED_MEALS_PATH);
}
</script>
