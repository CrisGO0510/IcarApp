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
          En la rutina ({{ selectedExercises.length }})
        </div>
        <draggable
          v-if="selectedExercises.length"
          v-model="selectedExercises"
          item-key="id"
          handle=".drag-handle"
          class="column q-gutter-y-sm"
        >
          <template #item="{ element }">
            <ExerciseSelectItem :exercise="element" selected handle @toggle="toggle(element.id)" />
          </template>
        </draggable>
        <div v-else class="text-center text-muted q-pa-lg">
          Marca ejercicios de la biblioteca para agregarlos.
        </div>
      </div>

      <div>
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-caption text-uppercase text-muted">
            Biblioteca ({{ libraryExercises.length }})
          </div>
          <q-btn
            flat
            dense
            round
            size="sm"
            color="primary"
            :icon="librarySortIcon"
            @click="toggleLibrarySort"
          />
        </div>
        <div v-if="libraryExercises.length" class="column q-gutter-y-sm">
          <ExerciseSelectItem
            v-for="exercise in libraryExercises"
            :key="exercise.id"
            :exercise="exercise"
            :selected="false"
            @toggle="toggle(exercise.id)"
          />
        </div>
        <div v-else class="text-center text-muted q-pa-lg">
          No hay más ejercicios. Agrega uno nuevo.
        </div>
      </div>
    </div>

    <ExerciseFormDialog v-model="showExerciseDialog" @create="onCreateExercise" />
  </q-page>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import ExerciseSelectItem from '../../components/ExerciseSelectItem/ExerciseSelectItem.vue';
import ExerciseFormDialog from '../../components/ExerciseFormDialog/ExerciseFormDialog.vue';
import { useRoutineFormPage } from './RoutineFormPage';

const {
  name,
  selectedExercises,
  libraryExercises,
  librarySortIcon,
  showExerciseDialog,
  toggle,
  toggleLibrarySort,
  openExerciseDialog,
  onCreateExercise,
  save,
} = useRoutineFormPage();
</script>
