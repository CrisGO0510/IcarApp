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
          <div class="row items-center q-gutter-x-sm">
            <span class="text-caption text-uppercase text-muted">Tus rutinas</span>
            <span class="text-caption text-primary">{{ sortedSummaries.length }} creadas</span>
          </div>
          <SegmentedToggle v-model="sortMode" :options="sortOptions" class="segmented--compact" />
        </div>

        <div v-if="sortedSummaries.length" class="column q-gutter-y-sm">
          <RoutineCard
            v-for="summary in sortedSummaries"
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
import SegmentedToggle from 'src/components/base/SegmentedToggle/SegmentedToggle.vue';
import { useRoutinesListPage } from './RoutinesListPage';

const {
  sortedSummaries,
  sortMode,
  sortOptions,
  goToLibrary,
  goToNew,
  openRoutine,
  editRoutine,
  deleteRoutine,
} = useRoutinesListPage();
</script>
