<template>
  <q-dialog v-model="open">
    <q-card class="app-card form-dialog form-dialog--narrow">
      <div class="text-h6 text-weight-bold q-mb-md">Registrar serie</div>
      <div class="text-caption text-muted q-mb-md">{{ exerciseName }}</div>

      <div class="row q-col-gutter-md">
        <div class="col-6">
          <div class="text-caption text-uppercase text-muted q-mb-xs">Peso ({{ weightUnit }})</div>
          <div class="column items-center q-gutter-xs">
            <q-btn
              round
              flat
              dense
              icon="keyboard_arrow_up"
              class="invisible"
              tabindex="-1"
              aria-hidden="true"
            />
            <q-input
              v-model.number="weight"
              type="number"
              dense
              outlined
              min="0"
              autofocus
              input-class="text-center"
              class="full-width"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="text-caption text-uppercase text-muted q-mb-xs">Repeticiones</div>
          <div class="column items-center q-gutter-xs">
            <q-btn
              round
              flat
              dense
              color="primary"
              icon="keyboard_arrow_up"
              aria-label="Aumentar repeticiones"
              @click="incReps"
            />
            <q-input
              v-model.number="reps"
              type="number"
              dense
              outlined
              min="0"
              input-class="text-center"
              class="full-width"
            />
            <q-btn
              round
              flat
              dense
              color="primary"
              icon="keyboard_arrow_down"
              aria-label="Disminuir repeticiones"
              @click="decReps"
            />
          </div>
        </div>
      </div>

      <div class="row justify-end q-gutter-sm q-mt-lg">
        <ActionButton :kind="ACTION_KIND.CANCEL" label="Cancelar" :block="false" @click="open = false" />
        <q-btn unelevated color="primary" no-caps label="Registrar" @click="submit" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ActionButton from 'src/components/base/ActionButton/ActionButton.vue';
import { ACTION_KIND } from 'src/components/base/ActionButton/ActionButton';
import type { WeightUnit } from '../../types/training.types';

const DEFAULT_WEIGHT_UNIT: WeightUnit = 'kg';

const open = defineModel<boolean>({ required: true });

const props = withDefaults(
  defineProps<{
    exerciseName: string;
    defaultReps: number;
    defaultWeight: number;
    weightUnit?: WeightUnit;
  }>(),
  { weightUnit: DEFAULT_WEIGHT_UNIT },
);

const emit = defineEmits<{ submit: [payload: { reps: number; weight: number }] }>();

const REP_STEP = 1;
const MIN_REPS = 0;

const reps = ref(0);
const weight = ref(0);

function incReps(): void {
  reps.value = (reps.value || 0) + REP_STEP;
}

function decReps(): void {
  reps.value = Math.max(MIN_REPS, (reps.value || 0) - REP_STEP);
}

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
