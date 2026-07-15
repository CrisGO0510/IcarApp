<template>
  <q-page class="q-pa-md">
    <Teleport defer to="#toolbar-action">
      <q-btn flat dense no-caps color="primary" label="Editar" @click="goToEdit" />
    </Teleport>

    <div class="column q-gutter-y-md page-content">
      <div>
        <div class="text-h6 text-weight-bold">{{ current?.name }}</div>
        <div
          v-if="currentInProgress"
          class="row items-center q-gutter-x-xs text-caption text-primary text-weight-medium"
        >
          <q-icon name="pending" size="14px" />
          <span class="text-uppercase">En progreso</span>
        </div>
      </div>

      <q-input v-model="query" dense outlined placeholder="Buscar ejercicio en esta rutina">
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn
        unelevated
        color="primary"
        size="lg"
        no-caps
        icon="add"
        label="Agregar ejercicio"
        class="full-width"
        @click="goToEdit"
      />

      <div class="text-caption text-uppercase text-muted">
        Ejercicios ({{ visibleExercises.length }})
      </div>

      <template v-if="visibleExercises.length">
        <q-slide-item
          v-for="view in visibleExercises"
          :key="view.pivotId"
          left-color="positive"
          right-color="negative"
          class="exercise-slide"
          @left="onSwipeSet(view, $event)"
          @right="onSwipeDelete(view, $event)"
        >
          <template #left>
            <div class="row items-center q-gutter-x-sm">
              <q-icon name="check" />
              <span>Serie</span>
            </div>
          </template>
          <template #right>
            <div class="row items-center q-gutter-x-sm">
              <q-icon name="delete" />
              <span>Eliminar</span>
            </div>
          </template>
          <ExerciseListItem
            :exercise="view.exercise"
            :caption="captionFor(view)"
            :status-label="statusLabelFor(view.pivotId)"
            :status-color="statusColorFor(view.pivotId)"
            @click="onOpenExercise(view.pivotId)"
          />
        </q-slide-item>
      </template>
      <div v-else class="text-center text-muted q-pa-lg">
        Esta rutina aún no tiene ejercicios. Agrégalos desde "Editar".
      </div>
    </div>

    <SetFormDialog
      v-model="showSetDialog"
      :exercise-name="activeExerciseName"
      :weight-unit="activeWeightUnit"
      :default-reps="activeDefaults.reps"
      :default-weight="activeDefaults.weight"
      @submit="onSubmitSet"
    />
  </q-page>
</template>

<script setup lang="ts">
import ExerciseListItem from '../../components/ExerciseListItem/ExerciseListItem.vue';
import SetFormDialog from '../../components/SetFormDialog/SetFormDialog.vue';
import { useRoutineDetailPage } from './RoutineDetailPage';

const {
  current,
  currentInProgress,
  visibleExercises,
  query,
  showSetDialog,
  activeExerciseName,
  activeWeightUnit,
  activeDefaults,
  captionFor,
  statusLabelFor,
  statusColorFor,
  onSwipeSet,
  onSwipeDelete,
  onSubmitSet,
  onOpenExercise,
  goToEdit,
} = useRoutineDetailPage();
</script>
