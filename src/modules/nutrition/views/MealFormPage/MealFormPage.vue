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
          <span class="text-micro text-uppercase text-muted">Cantidad</span>
        </div>
        <q-input v-model.number="quantity" type="number" min="0" dense outlined suffix="gr" />
      </div>

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
              <div class="text-micro text-uppercase text-muted q-mb-xs">Proteína</div>
              <q-input v-model.number="protein" type="number" min="0" dense borderless suffix="g" />
            </div>
          </div>
          <div class="col-4">
            <div class="surface-card">
              <div class="text-micro text-uppercase text-muted q-mb-xs">Carbs</div>
              <q-input
                v-model.number="carbohydrates"
                type="number"
                min="0"
                dense
                borderless
                suffix="g"
              />
            </div>
          </div>
          <div class="col-4">
            <div class="surface-card">
              <div class="text-micro text-uppercase text-muted q-mb-xs">Grasas</div>
              <q-input v-model.number="fat" type="number" min="0" dense borderless suffix="g" />
            </div>
          </div>
        </div>
      </div>

      <div class="surface-card surface-card--bordered">
        <div class="row items-center justify-between no-wrap">
          <div>
            <div class="row items-center q-gutter-xs q-mb-xs">
              <q-icon name="local_fire_department" color="primary" size="18px" />
              <span class="text-micro text-uppercase text-muted">Energía total</span>
            </div>
            <div>
              <span class="text-display">{{ calories }}</span>
              <span class="text-body text-muted q-ml-sm">kcal</span>
            </div>
          </div>
          <q-icon name="local_fire_department" color="primary" size="28px" />
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
        <q-btn flat no-caps color="negative" label="Cancelar" class="full-width" @click="cancel" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useMealFormPage } from './MealFormPage';

const { foodName, quantity, protein, carbohydrates, fat, calories, save, cancel } =
  useMealFormPage();
</script>
