<template>
  <q-page class="q-pa-md">
    <div class="column q-gutter-y-md page-content">
      <q-btn
        unelevated
        color="primary"
        size="lg"
        no-caps
        icon="add"
        label="Registrar peso de hoy"
        class="full-width"
        @click="openNew"
      />

      <div v-if="entries.length" class="column q-gutter-y-sm">
        <q-slide-item
          v-for="entry in entries"
          :key="entry.id"
          left-color="negative"
          class="weight-slide"
          @left="onDelete(entry)"
        >
          <template #left>
            <div class="row items-center q-gutter-x-sm">
              <q-icon name="delete" />
              <span>Eliminar</span>
            </div>
          </template>
          <q-card flat class="app-card cursor-pointer" @click="openEdit(entry)">
            <div class="row items-center justify-between no-wrap">
              <div>
                <div class="text-h2-section">{{ dayLabel(entry) }}</div>
                <div class="text-small text-muted q-mt-xs">{{ dateLabel(entry) }}</div>
              </div>
              <div class="text-right">
                <span class="text-numeric">{{ entry.weightKg }}</span>
                <span class="text-micro text-faint q-ml-xs">KG</span>
              </div>
            </div>
          </q-card>
        </q-slide-item>
      </div>
      <div v-else class="empty-box text-muted">Sin registros de peso. Registra el primero.</div>
    </div>

    <WeightLogDialog
      v-model="showDialog"
      :current="dialogWeight"
      :title="dialogTitle"
      @submit="onSubmit"
    />
  </q-page>
</template>

<script setup lang="ts">
import WeightLogDialog from '../../components/WeightLogDialog/WeightLogDialog.vue';
import { useWeightHistoryPage } from './WeightHistoryPage';

const {
  entries,
  showDialog,
  dialogTitle,
  dialogWeight,
  dayLabel,
  dateLabel,
  openNew,
  openEdit,
  onSubmit,
  onDelete,
} = useWeightHistoryPage();
</script>
