<template>
  <q-page class="q-pa-md">
    <Teleport defer to="#toolbar-action">
      <q-btn flat dense no-caps color="primary" label="Ordenar" icon-right="expand_more">
        <q-menu>
          <q-list dense style="min-width: 160px">
            <q-item
              v-for="option in sortOptions"
              :key="option.value"
              v-close-popup
              clickable
              @click="selectSort(option.value)"
            >
              <q-item-section>{{ option.label }}</q-item-section>
              <q-item-section v-if="sort === option.value" side>
                <q-icon name="check" color="primary" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </Teleport>

    <div class="column q-gutter-y-md page-content">
      <q-input v-model="searchModel" dense outlined placeholder="Buscar ejercicio">
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
        @click="openDialog"
      />

      <transition-group
        v-if="visibleExercises.length"
        name="exercise-list"
        tag="div"
        class="column q-gutter-y-sm"
      >
        <q-slide-item
          v-for="exercise in visibleExercises"
          :key="exercise.id"
          left-color="negative"
          right-color="negative"
          class="exercise-slide"
          v-on="{ [singleDeleteSide]: () => onDelete(exercise.id) }"
        >
          <template #[singleDeleteSide]>
            <div class="row items-center q-gutter-x-sm">
              <q-icon name="delete" />
              <span>Eliminar</span>
            </div>
          </template>
          <ExerciseListItem :exercise="exercise" @click="onEdit(exercise.id)" />
        </q-slide-item>
      </transition-group>
      <div v-else class="text-center text-muted q-pa-lg">
        No hay ejercicios. Agrega el primero.
      </div>
    </div>

    <ExerciseFormDialog v-model="showDialog" @create="onCreate" />
  </q-page>
</template>

<script setup lang="ts">
import ExerciseListItem from '../../components/ExerciseListItem/ExerciseListItem.vue';
import ExerciseFormDialog from '../../components/ExerciseFormDialog/ExerciseFormDialog.vue';
import { useExerciseLibraryPage } from './ExerciseLibraryPage';

const {
  visibleExercises,
  sort,
  singleDeleteSide,
  searchModel,
  showDialog,
  sortOptions,
  openDialog,
  onCreate,
  selectSort,
  onDelete,
  onEdit,
} = useExerciseLibraryPage();
</script>
