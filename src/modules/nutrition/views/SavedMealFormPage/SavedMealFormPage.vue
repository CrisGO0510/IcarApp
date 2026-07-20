<template>
  <q-page class="q-pa-md">
    <div class="column q-gutter-y-lg page-content">
      <div>
        <div class="row items-center q-gutter-xs q-mb-xs">
          <q-icon name="restaurant_menu" size="18px" class="text-muted" />
          <span class="text-micro text-uppercase text-muted">Nombre</span>
        </div>
        <q-input v-model="name" dense outlined placeholder="Ej. Arepa con queso" autofocus />
      </div>

      <div>
        <div class="row items-center q-gutter-xs q-mb-sm">
          <q-icon name="lunch_dining" size="18px" class="text-muted" />
          <span class="text-micro text-uppercase text-muted"
            >Macros por {{ SAVED_MEAL_BASE_GRAMS }} {{ MASS_UNIT }}</span
          >
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-4">
            <div class="surface-card">
              <div class="row items-center no-wrap q-gutter-xs q-mb-xs">
                <q-icon name="set_meal" color="negative" size="16px" />
                <span class="text-micro text-uppercase text-muted col ellipsis">Proteína</span>
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
        <div class="row items-center q-gutter-xs q-mb-xs">
          <q-icon name="local_fire_department" color="primary" size="18px" />
          <span class="text-micro text-uppercase text-muted"
            >Energía por {{ SAVED_MEAL_BASE_GRAMS }} {{ MASS_UNIT }} (opcional)</span
          >
        </div>
        <q-input
          v-model.number="calories"
          type="number"
          min="0"
          dense
          borderless
          :suffix="ENERGY_UNIT"
          aria-label="Energía por base"
        />
        <div class="text-small text-faint">Si la dejas en 0 se calcula con 4P + 4C + 9G.</div>
      </div>

      <div class="surface-card">
        <div class="row items-center q-gutter-xs q-mb-xs">
          <q-icon name="straighten" size="18px" class="text-muted" />
          <span class="text-micro text-uppercase text-muted">Peso de 1 unidad (opcional)</span>
        </div>
        <q-input
          v-model.number="unitGrams"
          type="number"
          min="0"
          dense
          borderless
          :suffix="MASS_UNIT"
          aria-label="Gramos por unidad"
        />
        <div class="text-small text-faint">
          Ej: 1 arepa = 75 {{ MASS_UNIT }}. Permite registrar por unidades.
        </div>
      </div>

      <div class="column q-gutter-y-sm">
        <q-btn
          unelevated
          color="primary"
          no-caps
          icon="save"
          label="Guardar"
          class="full-width"
          @click="save"
        />
        <ActionButton
          v-if="isEdit"
          :kind="ACTION_KIND.DELETE"
          label="Eliminar comida guardada"
          @click="remove"
        />
        <ActionButton :kind="ACTION_KIND.CANCEL" label="Cancelar" @click="cancel" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useSavedMealFormPage } from './SavedMealFormPage';
import { ENERGY_UNIT, MASS_UNIT, SAVED_MEAL_BASE_GRAMS } from '../../types/nutrition.types';
import ActionButton from 'src/components/base/ActionButton/ActionButton.vue';
import { ACTION_KIND } from 'src/components/base/ActionButton/ActionButton';

const { isEdit, name, protein, carbohydrates, fat, calories, unitGrams, save, remove, cancel } =
  useSavedMealFormPage();
</script>
