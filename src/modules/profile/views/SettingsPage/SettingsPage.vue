<template>
  <q-page class="q-pa-md">
    <Teleport defer to="#toolbar-action">
      <q-btn flat dense no-caps color="primary" label="Guardar" :loading="saving" @click="save" />
    </Teleport>

    <div class="column q-gutter-y-md page-content">
      <div class="text-micro text-uppercase text-muted">Perfil</div>

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

      <RestTimeSelector v-model="restTime" />

      <UnitSystemToggle v-model="form.unitSystem" />

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

      <q-btn
        label="Guardar cambios"
        color="primary"
        size="lg"
        no-caps
        class="full-width q-mt-sm"
        :loading="saving"
        :disable="saving"
        @click="save"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import FieldLabel from 'src/components/base/FieldLabel/FieldLabel.vue';
import RestTimeSelector from '../../components/RestTimeSelector/RestTimeSelector.vue';
import UnitSystemToggle from '../../components/UnitSystemToggle/UnitSystemToggle.vue';
import { useSettingsPage } from './SettingsPage';

const {
  form,
  restTime,
  submitted,
  saving,
  weightSuffix,
  heightSuffix,
  isPositive,
  save,
  sexOptions,
  dateOptions,
  dateKeyMask,
} = useSettingsPage();
</script>
