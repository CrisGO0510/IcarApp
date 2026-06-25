<template>
  <q-dialog v-model="open">
    <q-card class="app-card form-dialog form-dialog--narrow">
      <div class="text-h6 text-weight-bold q-mb-md">Registrar serie</div>
      <div class="text-caption text-muted q-mb-md">{{ exerciseName }}</div>

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

      <div class="row justify-end q-gutter-sm q-mt-lg">
        <q-btn flat no-caps label="Cancelar" @click="open = false" />
        <q-btn unelevated color="primary" no-caps label="Registrar" @click="submit" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const open = defineModel<boolean>({ required: true });

const props = defineProps<{
  exerciseName: string;
  defaultReps: number;
  defaultWeight: number;
}>();

const emit = defineEmits<{ submit: [payload: { reps: number; weight: number }] }>();

const reps = ref(0);
const weight = ref(0);

watch(open, (value) => {
  if (value) {
    reps.value = props.defaultReps;
    weight.value = props.defaultWeight;
  }
});

function submit(): void {
  emit('submit', { reps: reps.value || 0, weight: weight.value || 0 });
}
</script>
