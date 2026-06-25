<template>
  <q-dialog v-model="open">
    <q-card class="app-card form-dialog form-dialog--narrow">
      <div class="text-h6 text-weight-bold q-mb-md">Editar serie</div>

      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="text-caption text-uppercase text-muted q-mb-xs">Peso (kg)</div>
          <q-input v-model.number="weight" type="number" dense outlined min="0" autofocus />
        </div>
        <div class="col-6">
          <div class="text-caption text-uppercase text-muted q-mb-xs">Repeticiones</div>
          <q-input v-model.number="reps" type="number" dense outlined min="0" />
        </div>
      </div>

      <div class="q-mt-md">
        <div class="text-caption text-uppercase text-muted q-mb-xs">Notas</div>
        <q-input v-model="notes" type="textarea" autogrow dense outlined />
      </div>

      <div class="row justify-between items-center q-mt-lg">
        <q-btn flat no-caps color="negative" icon="delete" label="Eliminar" @click="onDelete" />
        <div class="row q-gutter-sm">
          <q-btn flat no-caps label="Cancelar" @click="open = false" />
          <q-btn unelevated color="primary" no-caps label="Guardar" @click="onSave" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ExerciseSet } from '../../types/training.types';

const open = defineModel<boolean>({ required: true });

const props = defineProps<{ set: ExerciseSet | null }>();

const emit = defineEmits<{
  save: [payload: { reps: number; weight: number; notes: string }];
  remove: [];
}>();

const reps = ref(0);
const weight = ref(0);
const notes = ref('');

watch(open, (value) => {
  if (value && props.set) {
    reps.value = props.set.reps ?? 0;
    weight.value = props.set.weight ?? 0;
    notes.value = props.set.notes ?? '';
  }
});

function onSave(): void {
  emit('save', { reps: reps.value || 0, weight: weight.value || 0, notes: notes.value });
}

function onDelete(): void {
  emit('remove');
}
</script>
