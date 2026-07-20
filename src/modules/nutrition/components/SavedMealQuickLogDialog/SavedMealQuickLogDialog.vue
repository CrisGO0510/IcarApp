<template>
  <q-dialog v-model="model">
    <q-card flat class="quick-log-card">
      <div class="text-h2-section">{{ meal.name }}</div>
      <div class="text-small text-muted q-mt-xs">{{ subtitle }}</div>

      <SegmentedToggle v-if="hasUnits" v-model="mode" :options="MODE_OPTIONS" class="q-mt-md" />

      <div
        v-if="mode === QUANTITY_MODE.UNITS"
        class="row items-center justify-center q-gutter-x-lg q-mt-md"
      >
        <q-btn
          round
          outline
          color="primary"
          icon="remove"
          :disable="units <= MIN_UNITS"
          aria-label="Menos unidades"
          @click="units -= 1"
        />
        <span class="text-display">{{ units }}</span>
        <q-btn
          round
          outline
          color="primary"
          icon="add"
          aria-label="Más unidades"
          @click="units += 1"
        />
      </div>
      <q-input
        v-else
        v-model.number="grams"
        type="number"
        min="0"
        dense
        outlined
        :suffix="MASS_UNIT"
        class="q-mt-md"
        autofocus
        aria-label="Cantidad en gramos"
      />

      <div class="surface-card surface-card--bordered q-mt-md">
        <div class="text-micro text-uppercase text-primary q-mb-xs">
          Equivale a {{ effectiveGrams }} {{ MASS_UNIT }}
        </div>
        <div class="text-display">{{ preview.calories }} {{ ENERGY_UNIT }}</div>
        <div class="text-muted q-mt-xs">
          P {{ preview.protein }} · C {{ preview.carbohydrates }} · G {{ preview.fat }}
        </div>
      </div>

      <div class="row items-center justify-end q-gutter-x-sm q-mt-md">
        <ActionButton
          :kind="ACTION_KIND.CANCEL"
          label="Cancelar"
          :block="false"
          @click="model = false"
        />
        <q-btn
          unelevated
          color="primary"
          no-caps
          label="Registrar"
          :disable="effectiveGrams <= 0"
          @click="submit"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useSavedMealStore } from '../../stores/savedMeal.store';
import { useNutritionStore } from '../../stores/nutrition.store';
import {
  ENERGY_UNIT,
  MASS_UNIT,
  QUANTITY_MODE,
  SAVED_MEAL_BASE_GRAMS,
} from '../../types/nutrition.types';
import type { QuantityMode, SavedMeal } from '../../types/nutrition.types';
import { scaleMealFromReference } from '../../use-cases/scaleMealFromReference';
import SegmentedToggle from 'src/components/base/SegmentedToggle/SegmentedToggle.vue';
import ActionButton from 'src/components/base/ActionButton/ActionButton.vue';
import { ACTION_KIND } from 'src/components/base/ActionButton/ActionButton';

const MODE_OPTIONS: ReadonlyArray<{ label: string; value: QuantityMode }> = [
  { label: 'Gramos', value: QUANTITY_MODE.GRAMS },
  { label: 'Unidades', value: QUANTITY_MODE.UNITS },
];
const MIN_UNITS = 1;

const model = defineModel<boolean>({ required: true });
const props = defineProps<{ meal: SavedMeal }>();

const $q = useQuasar();
const savedMealStore = useSavedMealStore();
const nutritionStore = useNutritionStore();

const mode = ref<QuantityMode>(QUANTITY_MODE.GRAMS);
const units = ref<number>(MIN_UNITS);
const grams = ref<number>(0);

const hasUnits = computed(() => props.meal.unitGrams !== null);

const subtitle = computed(() =>
  props.meal.unitGrams === null
    ? `${props.meal.caloriesPerBase} ${ENERGY_UNIT} / ${SAVED_MEAL_BASE_GRAMS} ${MASS_UNIT}`
    : `${props.meal.caloriesPerBase} ${ENERGY_UNIT} / ${SAVED_MEAL_BASE_GRAMS} ${MASS_UNIT} · 1 unidad = ${props.meal.unitGrams} ${MASS_UNIT}`,
);

watch(
  model,
  (open) => {
    if (!open) return;
    mode.value = hasUnits.value ? QUANTITY_MODE.UNITS : QUANTITY_MODE.GRAMS;
    units.value = MIN_UNITS;
    grams.value = 0;
  },
  { immediate: true },
);

const effectiveGrams = computed(() =>
  mode.value === QUANTITY_MODE.UNITS ? units.value * (props.meal.unitGrams ?? 0) : grams.value || 0,
);

const preview = computed(() =>
  scaleMealFromReference(
    {
      base: SAVED_MEAL_BASE_GRAMS,
      protein: props.meal.proteinPerBase,
      carbohydrates: props.meal.carbohydratesPerBase,
      fat: props.meal.fatPerBase,
      calories: props.meal.caloriesPerBase,
    },
    effectiveGrams.value,
  ),
);

async function submit(): Promise<void> {
  try {
    await savedMealStore.logToDay(props.meal, {
      mode: mode.value,
      amount: mode.value === QUANTITY_MODE.UNITS ? units.value : grams.value || 0,
      date: nutritionStore.date,
    });
    await nutritionStore.loadDay(nutritionStore.date);
    model.value = false;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error instanceof Error ? error.message : 'No se pudo registrar la comida.',
    });
  }
}
</script>
