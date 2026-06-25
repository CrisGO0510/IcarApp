<template>
  <q-dialog v-model="open">
    <q-card class="app-card form-dialog form-dialog--narrow">
      <div class="text-h6 text-weight-bold q-mb-md">Registrar peso</div>
      <div class="text-caption text-uppercase text-muted q-mb-xs">Peso (kg)</div>
      <q-input
        v-model.number="weightKg"
        type="number"
        dense
        outlined
        min="0"
        step="0.1"
        autofocus
        suffix="kg"
      />
      <div class="row justify-end q-gutter-sm q-mt-lg">
        <q-btn flat no-caps label="Cancelar" @click="open = false" />
        <q-btn unelevated color="primary" no-caps label="Guardar" @click="submit" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const open = defineModel<boolean>({ required: true });

const props = defineProps<{ current: number | null }>();

const emit = defineEmits<{ submit: [weightKg: number] }>();

const weightKg = ref(0);

watch(open, (value) => {
  if (value) weightKg.value = props.current ?? 0;
});

function submit(): void {
  if (weightKg.value > 0) emit('submit', weightKg.value);
}
</script>
