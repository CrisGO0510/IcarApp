<template>
  <div class="onboarding-page q-pa-lg">
    <div class="column q-gutter-md" style="max-width: 480px; margin: 0 auto">
      <!-- Header -->
      <div class="text-center q-mb-md">
        <q-icon name="fitness_center" size="48px" color="primary" />
        <div class="text-h5 text-weight-bold q-mt-sm">Bienvenido a IcarApp</div>
        <div class="text-body2 text-grey-6 q-mt-xs">
          Configura tu perfil para optimizar cada una de tus repeticiones.
        </div>
      </div>

      <!-- Name -->
      <div>
        <div class="text-caption text-grey-5 q-mb-xs">TU NOMBRE</div>
        <q-input
          v-model="form.name"
          placeholder="Ej. Cristhian Giraldo"
          dense
          dark
          outlined
          :error="submitted && !form.name"
        />
      </div>

      <!-- Rest time -->
      <RestTimeSelector v-model="restTime" />

      <!-- Unit system -->
      <UnitSystemToggle v-model="form.unitSystem" />

      <!-- Maintenance calories + Weight -->
      <div class="row q-gutter-sm">
        <div class="col">
          <div class="text-caption text-grey-5 q-mb-xs">MANTENIMIENTO</div>
          <q-input
            v-model.number="form.maintenanceCalories"
            type="number"
            dense
            dark
            outlined
            suffix="kcal"
            :error="submitted && !isPositive(form.maintenanceCalories)"
          />
        </div>
        <div class="col">
          <div class="text-caption text-grey-5 q-mb-xs">PESO ACTUAL</div>
          <q-input
            v-model.number="form.weight"
            type="number"
            dense
            dark
            outlined
            :suffix="weightSuffix"
            :error="submitted && !isPositive(form.weight)"
          />
        </div>
      </div>

      <!-- Height -->
      <div>
        <div class="text-caption text-grey-5 q-mb-xs">ALTURA</div>
        <q-input
          v-model.number="form.height"
          type="number"
          dense
          dark
          outlined
          :suffix="heightSuffix"
          :error="submitted && !isPositive(form.height)"
        />
      </div>

      <!-- Disclaimer -->
      <div class="text-caption text-grey-7 text-center q-mt-sm">
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
} = useOnboardingPage();
</script>

<style scoped lang="scss" src="./OnboardingPage.scss"></style>
