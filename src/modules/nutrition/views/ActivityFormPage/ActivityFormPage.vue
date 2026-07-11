<template>
  <q-page class="q-pa-md">
    <div class="column q-gutter-y-lg page-content">
      <div>
        <div class="row items-center q-gutter-xs q-mb-xs">
          <q-icon name="directions_run" size="18px" class="text-muted" />
          <span class="text-micro text-uppercase text-muted">Tipo de ejercicio</span>
        </div>
        <q-select
          v-model="selectedType"
          :options="typeOptions"
          dense
          outlined
          aria-label="Tipo de ejercicio"
        />
        <q-input
          v-if="isOther"
          v-model="customType"
          dense
          outlined
          placeholder="Ej. Escalada"
          class="q-mt-sm"
          aria-label="Tipo personalizado"
        />
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-6">
          <div class="surface-card">
            <div class="text-micro text-uppercase text-muted ellipsis q-mb-xs">
              Calorías quemadas
            </div>
            <q-input
              v-model.number="caloriesBurned"
              type="number"
              min="0"
              dense
              borderless
              suffix="kcal"
              aria-label="Calorías quemadas"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="surface-card">
            <div class="text-micro text-uppercase text-muted ellipsis q-mb-xs">Duración</div>
            <q-input
              v-model.number="durationMinutes"
              type="number"
              min="0"
              dense
              borderless
              suffix="min"
              aria-label="Duración"
            />
          </div>
        </div>
      </div>

      <div class="column q-gutter-y-sm">
        <q-btn
          unelevated
          color="primary"
          no-caps
          icon="save"
          label="Guardar actividad"
          class="full-width"
          @click="save"
        />
        <q-btn
          v-if="isEdit"
          flat
          no-caps
          color="negative"
          icon="delete"
          label="Eliminar actividad"
          class="full-width"
          @click="remove"
        />
        <q-btn flat no-caps color="negative" label="Cancelar" class="full-width" @click="cancel" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useActivityFormPage } from './ActivityFormPage';

const {
  isEdit,
  selectedType,
  customType,
  isOther,
  typeOptions,
  caloriesBurned,
  durationMinutes,
  save,
  remove,
  cancel,
} = useActivityFormPage();
</script>
