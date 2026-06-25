<template>
  <q-page class="q-pa-md">
    <Teleport defer to="#toolbar-action">
      <q-btn flat dense no-caps color="primary" label="Guardar" @click="save" />
    </Teleport>

    <div class="column q-gutter-y-md page-content">
      <div>
        <div class="text-caption text-uppercase text-muted q-mb-sm">Nombre</div>
        <q-input v-model="name" dense outlined placeholder="Ingrese el nombre de la rutina" />
      </div>

      <q-btn
        outline
        color="primary"
        size="lg"
        no-caps
        icon="add"
        label="Agregar nuevo ejercicio"
        class="full-width"
        @click="openExerciseDialog"
      />

      <div>
        <div class="text-caption text-uppercase text-muted q-mb-sm">
          Mis ejercicios ({{ orderedExercises.length }})
        </div>
        <div v-if="orderedExercises.length" class="column q-gutter-y-sm">
          <ExerciseSelectItem
            v-for="exercise in orderedExercises"
            :key="exercise.id"
            :exercise="exercise"
            :selected="isSelected(exercise.id)"
            @toggle="toggle(exercise.id)"
          />
        </div>
        <div v-else class="text-center text-muted q-pa-lg">
          No hay ejercicios. Agrega uno nuevo.
        </div>
      </div>
    </div>

    <ExerciseFormDialog v-model="showExerciseDialog" @create="onCreateExercise" />
  </q-page>
</template>

<script setup lang="ts">
import ExerciseSelectItem from '../../components/ExerciseSelectItem/ExerciseSelectItem.vue';
import ExerciseFormDialog from '../../components/ExerciseFormDialog/ExerciseFormDialog.vue';
import { useRoutineFormPage } from './RoutineFormPage';

const {
  name,
  orderedExercises,
  showExerciseDialog,
  isSelected,
  toggle,
  openExerciseDialog,
  onCreateExercise,
  save,
} = useRoutineFormPage();
</script>
