<template>
  <q-dialog v-model="open">
    <q-card class="app-card form-dialog form-dialog--narrow">
      <div class="text-h6 text-weight-bold q-mb-xs">Estimar calorías de mantenimiento</div>
      <div class="text-small text-muted q-mb-md">
        Gasto basal (Mifflin-St Jeor) ajustado por tu frecuencia de entrenamiento.
      </div>

      <div class="column q-gutter-y-md">
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <div class="text-caption text-uppercase text-muted q-mb-xs">Peso</div>
            <q-input
              v-model.number="weight"
              type="number"
              min="0"
              dense
              outlined
              :suffix="weightSuffix"
              aria-label="Peso"
            />
          </div>
          <div class="col-6">
            <div class="text-caption text-uppercase text-muted q-mb-xs">Altura</div>
            <q-input
              v-model.number="height"
              type="number"
              min="0"
              dense
              outlined
              :suffix="heightSuffix"
              aria-label="Altura"
            />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <div class="text-caption text-uppercase text-muted q-mb-xs">Edad</div>
            <q-input
              v-model.number="age"
              type="number"
              min="0"
              dense
              outlined
              suffix="años"
              aria-label="Edad"
            />
          </div>
          <div class="col-6">
            <div class="text-caption text-uppercase text-muted q-mb-xs">Sexo</div>
            <q-select
              v-model="sex"
              :options="sexOptions"
              emit-value
              map-options
              dense
              outlined
              aria-label="Sexo"
            />
          </div>
        </div>

        <div>
          <div class="text-caption text-uppercase text-muted q-mb-xs">¿Cuánto entrenas?</div>
          <q-select
            v-model="trainingFrequency"
            :options="frequencyOptions"
            emit-value
            map-options
            dense
            outlined
            aria-label="Frecuencia de entrenamiento"
          />
        </div>

        <div class="surface-card surface-card--bordered">
          <template v-if="estimate !== null">
            <div class="text-display">{{ caloriesLabel }}</div>
            <div class="text-caption text-uppercase text-muted">Mantenimiento estimado (kcal)</div>
            <div class="text-small text-faint q-mt-xs">
              TMB {{ tmbLabel }} × {{ estimate.factor }}
            </div>
          </template>
          <template v-else>
            <div class="text-small text-muted">Completa los datos para ver la estimación.</div>
          </template>
        </div>
      </div>

      <div class="row justify-end q-gutter-sm q-mt-lg">
        <ActionButton :kind="ACTION_KIND.CANCEL" label="Cancelar" :block="false" @click="open = false" />
        <q-btn
          unelevated
          color="primary"
          no-caps
          label="Usar valor"
          :disable="estimate === null"
          @click="apply"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';
import { SEX_OPTIONS } from 'src/modules/profile/types/profile.types';
import type { Sex } from 'src/modules/profile/types/profile.types';
import { computeMaintenanceEstimate, TRAINING_FREQUENCIES } from 'src/modules/profile/use-cases/computeTmb';
import type { TrainingFrequencyKey } from 'src/modules/profile/use-cases/computeTmb';
import { calculateAge } from 'src/modules/profile/use-cases/calculateAge';
import ActionButton from 'src/components/base/ActionButton/ActionButton.vue';
import { ACTION_KIND } from 'src/components/base/ActionButton/ActionButton';

const open = defineModel<boolean>({ required: true });

const emit = defineEmits<{ apply: [kcal: number] }>();

const profileStore = useProfileStore();

const weight = ref(0);
const height = ref(0);
const age = ref(0);
const sex = ref<Sex | null>(null);
const trainingFrequency = ref<TrainingFrequencyKey | null>(null);

const unitSystem = computed(() => profileStore.profile?.unitSystem ?? 'metric');
const weightSuffix = computed(() => (unitSystem.value === 'metric' ? 'kg' : 'lbs'));
const heightSuffix = computed(() => (unitSystem.value === 'metric' ? 'cm' : 'in'));

watch(open, (value) => {
  if (!value) return;
  const profile = profileStore.profile;
  weight.value = profile?.weight ?? 0;
  height.value = profile?.height ?? 0;
  age.value = profile?.birthDate ? calculateAge(profile.birthDate, new Date()) : 0;
  sex.value = profile?.sex ?? null;
  trainingFrequency.value = null;
});

const estimate = computed(() => {
  if (
    weight.value > 0 &&
    height.value > 0 &&
    age.value > 0 &&
    sex.value !== null &&
    trainingFrequency.value !== null
  ) {
    return computeMaintenanceEstimate(
      {
        weight: weight.value,
        height: height.value,
        unitSystem: unitSystem.value,
        age: age.value,
        sex: sex.value,
      },
      trainingFrequency.value,
    );
  }
  return null;
});

const caloriesLabel = computed(() => estimate.value?.calories.toLocaleString('en-US') ?? '');
const tmbLabel = computed(() => estimate.value?.tmb.toLocaleString('en-US') ?? '');

const sexOptions = SEX_OPTIONS;
const frequencyOptions = TRAINING_FREQUENCIES.map((item) => ({
  label: item.label,
  value: item.key,
}));

function apply(): void {
  if (estimate.value === null) return;
  emit('apply', estimate.value.calories);
  open.value = false;
}
</script>
