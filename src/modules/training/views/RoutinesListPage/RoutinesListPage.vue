<template>
  <q-page class="q-pa-md">
    <div class="column q-gutter-y-md page-content">
      <q-btn
        unelevated
        color="primary"
        no-caps
        icon="add"
        label="Agregar rutina"
        class="full-width"
        @click="goToNew"
      />

      <div>
        <div class="text-caption text-uppercase text-muted q-mb-sm">Biblioteca</div>
        <LibraryEntryCard @open="goToLibrary" />
      </div>

      <div>
        <div class="row items-center justify-between q-mb-sm">
          <span class="text-caption text-uppercase text-muted">Tus rutinas</span>
          <span class="text-caption text-primary">{{ summaries.length }} creadas</span>
        </div>

        <div v-if="summaries.length" class="column q-gutter-y-sm">
          <RoutineCard
            v-for="summary in summaries"
            :key="summary.routine.id"
            :summary="summary"
            @open="openRoutine(summary)"
            @edit="editRoutine(summary)"
            @delete="deleteRoutine(summary)"
          />
        </div>
        <div v-else class="text-center text-muted q-pa-lg">
          Aún no tienes rutinas. Crea la primera.
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import RoutineCard from '../../components/RoutineCard/RoutineCard.vue';
import LibraryEntryCard from '../../components/LibraryEntryCard/LibraryEntryCard.vue';
import { useRoutinesListPage } from './RoutinesListPage';

const { summaries, goToLibrary, goToNew, openRoutine, editRoutine, deleteRoutine } =
  useRoutinesListPage();
</script>
