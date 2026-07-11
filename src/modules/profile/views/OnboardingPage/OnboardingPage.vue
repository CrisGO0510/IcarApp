<template>
  <div class="onboarding-page q-pa-lg">
    <div class="column q-gutter-y-md page-content">
      <!-- Header -->
      <div class="text-center q-mb-md">
        <q-icon name="fitness_center" size="48px" color="primary" />
        <div class="text-h1-page q-mt-sm">Bienvenido a IcarApp</div>
        <div class="text-body2 text-muted q-mt-xs">
          Configura tu perfil para optimizar cada una de tus repeticiones.
        </div>
      </div>

      <!-- Name -->
      <div>
        <FieldLabel>TU NOMBRE</FieldLabel>
        <q-input
          v-model="form.name"
          placeholder="Ej. Cristhian Giraldo"
          dense
          outlined
          :error="submitted && !form.name"
        />
      </div>

      <!-- Rest time -->
      <RestTimeSelector v-model="restTime" />

      <!-- Unit system -->
      <UnitSystemToggle v-model="form.unitSystem" />

      <!-- Weight + Height -->
      <div class="row q-col-gutter-sm">
        <div class="col">
          <FieldLabel>PESO ACTUAL</FieldLabel>
          <q-input
            v-model.number="form.weight"
            type="number"
            dense
            outlined
            :suffix="weightSuffix"
            :error="submitted && !isPositive(form.weight)"
          />
        </div>
        <div class="col">
          <FieldLabel>ALTURA</FieldLabel>
          <q-input
            v-model.number="form.height"
            type="number"
            dense
            outlined
            :suffix="heightSuffix"
            :error="submitted && !isPositive(form.height)"
          />
        </div>
      </div>

      <!-- Birth date -->
      <div>
        <FieldLabel>FECHA DE NACIMIENTO</FieldLabel>
        <q-input
          :model-value="form.birthDate"
          dense
          outlined
          readonly
          class="cursor-pointer"
          aria-label="Fecha de nacimiento"
        >
          <template #append>
            <q-icon name="event" />
          </template>
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="form.birthDate" :mask="dateKeyMask" :options="dateOptions" />
          </q-popup-proxy>
        </q-input>
      </div>

      <!-- Sex -->
      <div>
        <FieldLabel>SEXO</FieldLabel>
        <q-select
          v-model="form.sex"
          :options="sexOptions"
          emit-value
          map-options
          dense
          outlined
          aria-label="Sexo"
        />
      </div>

      <!-- Disclaimer -->
      <div class="text-caption text-faint text-center q-mt-sm">
        Tus datos se almacenan localmente en tu dispositivo. No compartimos tu información.
      </div>

      <!-- Submit -->
      <q-btn
        label="Comenzar"
        color="primary"
        size="lg"
        no-caps
        class="full-width q-mt-md"
        :loading="saving"
        :disable="saving"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import FieldLabel from 'src/components/base/FieldLabel/FieldLabel.vue';
import RestTimeSelector from '../../components/RestTimeSelector/RestTimeSelector.vue';
import UnitSystemToggle from '../../components/UnitSystemToggle/UnitSystemToggle.vue';
import { useOnboardingPage } from './OnboardingPage';

const {
  form,
  restTime,
  submitted,
  saving,
  weightSuffix,
  heightSuffix,
  isPositive,
  handleSubmit,
  sexOptions,
  dateOptions,
  dateKeyMask,
} = useOnboardingPage();
</script>
