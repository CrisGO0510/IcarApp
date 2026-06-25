<template>
  <q-page class="q-pa-md">
    <Teleport defer to="#toolbar-action">
      <q-btn flat dense no-caps color="primary" label="Guardar" @click="save" />
    </Teleport>

    <div class="column q-gutter-y-lg page-content">
      <div>
        <div class="text-caption text-uppercase text-muted q-mb-sm">Cambiar nombre</div>
        <q-input v-model="name" dense outlined />
      </div>

      <div>
        <div class="row items-center q-gutter-x-xs q-mb-sm">
          <span class="text-caption text-uppercase text-muted">Editar tiempo de descanso</span>
          <q-icon name="info" size="16px" class="text-muted">
            <q-tooltip>Descanso entre series para este ejercicio.</q-tooltip>
          </q-icon>
        </div>

        <q-card flat class="app-card">
          <div class="row items-center justify-between no-wrap">
            <span>Usar tiempo por defecto</span>
            <q-toggle v-model="useDefault" color="primary" />
          </div>

          <div v-if="!useDefault" class="row items-center justify-center q-gutter-x-md q-mt-md">
            <div class="rest-box column items-center">
              <q-input
                v-model.number="minutes"
                type="number"
                dense
                borderless
                min="0"
                max="59"
                input-class="text-h5 text-weight-bold text-center"
              />
              <span class="text-caption text-muted">MIN</span>
            </div>
            <span class="text-h5 text-weight-bolder">:</span>
            <div class="rest-box column items-center">
              <q-input
                v-model.number="seconds"
                type="number"
                dense
                borderless
                min="0"
                max="59"
                input-class="text-h5 text-weight-bold text-center"
              />
              <span class="text-caption text-muted">SEG</span>
            </div>
          </div>
        </q-card>
      </div>

      <q-btn no-caps class="delete-btn full-width" color="negative" size="lg" flat @click="remove">
        Eliminar ejercicio
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useExerciseEditPage } from './ExerciseEditPage';

const { name, useDefault, minutes, seconds, save, remove } = useExerciseEditPage();
</script>
