<template>
  <q-page class="q-pa-md">
    <div class="column q-gutter-y-lg page-content">
      <div>
        <div class="row items-center q-gutter-xs q-mb-xs">
          <q-icon name="restaurant_menu" size="18px" class="text-muted" />
          <span class="text-micro text-uppercase text-muted">Nombre de la comida</span>
        </div>
        <q-input v-model="foodName" dense outlined placeholder="Ej. Pechuga de pollo" autofocus />
      </div>

      <div>
        <div class="row items-center q-gutter-xs q-mb-xs">
          <q-icon name="straighten" size="18px" class="text-muted" />
          <span class="text-micro text-uppercase text-muted">Cantidad que comiste</span>
        </div>
        <q-input
          v-model.number="quantity"
          type="number"
          min="0"
          dense
          outlined
          :suffix="MASS_UNIT"
        />
      </div>

      <q-tabs
        v-model="mode"
        dense
        no-caps
        class="meal-mode-tabs"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab :name="MEAL_MODE.MANUAL" icon="edit" label="Manual" />
        <q-tab :name="MEAL_MODE.CALCULATE" icon="calculate" label="Calcular" />
      </q-tabs>

      <q-tab-panels v-model="mode" animated class="meal-mode-panels">
        <q-tab-panel :name="MEAL_MODE.MANUAL" class="q-pa-none">
          <div class="column q-gutter-y-lg">
            <div>
              <div class="row items-center justify-between q-mb-sm">
                <div class="row items-center q-gutter-xs">
                  <q-icon name="lunch_dining" size="18px" class="text-muted" />
                  <span class="text-micro text-uppercase text-muted">Macros principales</span>
                </div>
                <span class="pill-badge">EDITABLE</span>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-4">
                  <div class="surface-card">
                    <div class="row items-center no-wrap q-gutter-xs q-mb-xs">
                      <q-icon name="set_meal" color="negative" size="16px" />
                      <span class="text-micro text-uppercase text-muted col ellipsis"
                        >Proteína</span
                      >
                    </div>
                    <q-input
                      v-model.number="protein"
                      type="number"
                      min="0"
                      dense
                      borderless
                      :suffix="MASS_UNIT"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="surface-card">
                    <div class="row items-center no-wrap q-gutter-xs q-mb-xs">
                      <q-icon name="bakery_dining" color="warning" size="16px" />
                      <span class="text-micro text-uppercase text-muted col ellipsis">Carbs</span>
                    </div>
                    <q-input
                      v-model.number="carbohydrates"
                      type="number"
                      min="0"
                      dense
                      borderless
                      :suffix="MASS_UNIT"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="surface-card">
                    <div class="row items-center no-wrap q-gutter-xs q-mb-xs">
                      <q-icon name="water_drop" color="info" size="16px" />
                      <span class="text-micro text-uppercase text-muted col ellipsis">Grasas</span>
                    </div>
                    <q-input
                      v-model.number="fat"
                      type="number"
                      min="0"
                      dense
                      borderless
                      :suffix="MASS_UNIT"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="surface-card surface-card--bordered">
              <div class="row items-center justify-between no-wrap">
                <div class="col">
                  <div class="row items-center q-gutter-xs q-mb-xs">
                    <q-icon name="local_fire_department" color="primary" size="18px" />
                    <span class="text-micro text-uppercase text-muted">Energía total</span>
                  </div>
                  <q-input
                    v-model.number="calories"
                    type="number"
                    min="0"
                    dense
                    borderless
                    :suffix="ENERGY_UNIT"
                    input-class="text-display"
                    aria-label="Energía total"
                  />
                </div>
                <q-icon name="local_fire_department" color="primary" size="28px" />
              </div>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel :name="MEAL_MODE.CALCULATE" class="q-pa-none">
          <div class="column q-gutter-y-lg">
            <div class="surface-card">
              <div class="row items-center justify-between q-mb-sm">
                <div class="row items-center q-gutter-xs">
                  <q-icon name="table_chart" size="18px" class="text-muted" />
                  <span class="text-micro text-uppercase text-muted">Tabla nutricional</span>
                </div>
                <div class="row items-center no-wrap base-field">
                  <span class="text-micro text-muted">por</span>
                  <q-input
                    v-model.number="base"
                    type="number"
                    min="1"
                    dense
                    borderless
                    input-class="text-center text-primary text-weight-bold base-field__input"
                    aria-label="Base de referencia en gramos"
                  />
                  <span class="text-micro text-muted">{{ MASS_UNIT }}</span>
                </div>
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-4">
                  <div class="surface-card surface-card--nested">
                    <div class="row items-center no-wrap q-gutter-xs q-mb-xs">
                      <q-icon name="set_meal" color="negative" size="16px" />
                      <span class="text-micro text-uppercase text-muted col ellipsis"
                        >Proteína</span
                      >
                    </div>
                    <q-input
                      v-model.number="baseProtein"
                      type="number"
                      min="0"
                      dense
                      borderless
                      :suffix="MASS_UNIT"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="surface-card surface-card--nested">
                    <div class="row items-center no-wrap q-gutter-xs q-mb-xs">
                      <q-icon name="bakery_dining" color="warning" size="16px" />
                      <span class="text-micro text-uppercase text-muted col ellipsis">Carbs</span>
                    </div>
                    <q-input
                      v-model.number="baseCarbohydrates"
                      type="number"
                      min="0"
                      dense
                      borderless
                      :suffix="MASS_UNIT"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="surface-card surface-card--nested">
                    <div class="row items-center no-wrap q-gutter-xs q-mb-xs">
                      <q-icon name="water_drop" color="info" size="16px" />
                      <span class="text-micro text-uppercase text-muted col ellipsis">Grasas</span>
                    </div>
                    <q-input
                      v-model.number="baseFat"
                      type="number"
                      min="0"
                      dense
                      borderless
                      :suffix="MASS_UNIT"
                    />
                  </div>
                </div>
              </div>
              <div class="surface-card surface-card--nested q-mt-sm">
                <div class="row items-center no-wrap justify-between">
                  <div class="row items-center q-gutter-xs">
                    <q-icon name="local_fire_department" color="primary" size="16px" />
                    <span class="text-micro text-uppercase text-muted">Energía (opcional)</span>
                  </div>
                  <q-input
                    v-model.number="baseCalories"
                    type="number"
                    min="0"
                    dense
                    borderless
                    :suffix="ENERGY_UNIT"
                    input-class="text-right"
                    aria-label="Energía por base"
                  />
                </div>
              </div>
            </div>

            <div class="surface-card surface-card--bordered calc-preview">
              <div class="text-micro text-uppercase text-primary q-mb-xs">
                Equivale a {{ quantity || 0 }} {{ MASS_UNIT }}
              </div>
              <div class="row items-center no-wrap justify-between">
                <div class="text-display calc-preview__kcal">
                  {{ calculated.calories }} {{ ENERGY_UNIT }}
                </div>
                <q-icon name="local_fire_department" color="primary" size="28px" />
              </div>
              <div class="text-muted q-mt-xs">
                P {{ calculated.protein }} {{ MASS_UNIT }} · C {{ calculated.carbohydrates }}
                {{ MASS_UNIT }} · G {{ calculated.fat }} {{ MASS_UNIT }}
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <div>
        <div class="row items-center q-gutter-xs q-mb-xs">
          <q-icon name="description" size="18px" class="text-muted" />
          <span class="text-micro text-uppercase text-muted">Notas</span>
        </div>
        <q-input v-model="notes" type="textarea" autogrow dense outlined aria-label="Notas" />
      </div>

      <div>
        <q-checkbox
          v-model="saveToLibrary"
          :disable="!canSaveToLibrary"
          label="Guardar también en mis comidas"
        />
        <div v-if="!canSaveToLibrary" class="text-small text-faint">
          Ingresa la cantidad en gramos para poder guardarla en tu biblioteca.
        </div>
      </div>

      <div class="column q-gutter-y-sm">
        <q-btn
          unelevated
          color="primary"
          no-caps
          icon="save"
          label="Guardar comida"
          class="full-width"
          @click="save"
        />
        <ActionButton
          v-if="isEdit"
          :kind="ACTION_KIND.DELETE"
          label="Eliminar comida"
          @click="remove"
        />
        <ActionButton :kind="ACTION_KIND.CANCEL" label="Cancelar" @click="cancel" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useMealFormPage, MEAL_MODE } from './MealFormPage';
import { MASS_UNIT, ENERGY_UNIT } from '../../types/nutrition.types';
import ActionButton from 'src/components/base/ActionButton/ActionButton.vue';
import { ACTION_KIND } from 'src/components/base/ActionButton/ActionButton';

const {
  isEdit,
  foodName,
  quantity,
  protein,
  carbohydrates,
  fat,
  notes,
  calories,
  mode,
  base,
  baseProtein,
  baseCarbohydrates,
  baseFat,
  baseCalories,
  calculated,
  saveToLibrary,
  canSaveToLibrary,
  save,
  remove,
  cancel,
} = useMealFormPage();
</script>
