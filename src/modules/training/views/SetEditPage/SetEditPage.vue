<template>
  <q-page class="q-pa-md">
    <Teleport defer to="#toolbar-action">
      <q-btn flat dense no-caps color="primary" label="Guardar" @click="save" />
    </Teleport>

    <div class="column q-gutter-y-lg page-content">
      <div>
        <div class="text-caption text-uppercase text-muted q-mb-sm">Ejercicio</div>
        <q-card flat class="app-card">
          <div class="text-caption text-muted">Nombre del ejercicio</div>
          <div class="text-weight-bold">{{ exerciseName }}</div>
        </q-card>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="text-caption text-uppercase text-muted q-mb-sm">Repeticiones</div>
          <q-input
            v-model.number="reps"
            type="number"
            dense
            outlined
            min="0"
            suffix="reps"
            aria-label="Repeticiones"
          />
        </div>
        <div class="col-6">
          <div class="text-caption text-uppercase text-muted q-mb-sm">Peso</div>
          <q-input
            v-model.number="weight"
            type="number"
            dense
            outlined
            min="0"
            suffix="kg"
            aria-label="Peso"
          />
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="text-caption text-uppercase text-muted q-mb-sm">Fecha</div>
          <q-input
            :model-value="dateValue"
            dense
            outlined
            readonly
            class="cursor-pointer"
            aria-label="Fecha"
          >
            <template #append>
              <q-icon name="event" />
            </template>
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="dateValue" :mask="dateMask" />
            </q-popup-proxy>
          </q-input>
        </div>
        <div class="col-6">
          <div class="text-caption text-uppercase text-muted q-mb-sm">Hora</div>
          <q-input
            :model-value="timeValue"
            dense
            outlined
            readonly
            class="cursor-pointer"
            aria-label="Hora"
          >
            <template #append>
              <q-icon name="schedule" />
            </template>
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="timeValue" :mask="timeMask" format24h />
            </q-popup-proxy>
          </q-input>
        </div>
      </div>

      <div>
        <div class="text-caption text-uppercase text-muted q-mb-sm">Notas del entrenamiento</div>
        <q-input
          v-model="notes"
          type="textarea"
          autogrow
          dense
          outlined
          aria-label="Notas del entrenamiento"
        />
      </div>

      <q-btn no-caps class="delete-btn full-width" color="negative" size="lg" flat @click="remove">
        Eliminar serie
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useSetEditPage } from './SetEditPage';

const {
  exerciseName,
  reps,
  weight,
  notes,
  dateValue,
  timeValue,
  dateMask,
  timeMask,
  save,
  remove,
} = useSetEditPage();
</script>
