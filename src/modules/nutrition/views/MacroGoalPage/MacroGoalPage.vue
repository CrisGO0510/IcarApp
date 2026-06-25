<template>
  <q-page class="q-pa-md">
    <div class="column q-gutter-y-lg page-content">
      <div>
        <div class="text-micro text-uppercase text-muted q-mb-sm">Presupuesto energético</div>
        <div class="app-card">
          <div class="row items-center q-gutter-sm q-mb-md">
            <q-icon name="local_fire_department" color="primary" size="22px" />
            <span class="text-h2-section">Calorías de mantenimiento</span>
          </div>
          <div class="surface-card surface-card--bordered">
            <div class="row items-center justify-between no-wrap">
              <q-input
                v-model.number="calorieGoal"
                type="number"
                min="0"
                dense
                borderless
                class="text-display col"
                input-class="text-display"
              />
              <span class="text-body text-muted">kcal</span>
            </div>
          </div>
          <div class="text-small text-faint q-mt-sm">
            Usa tus calorías de mantenimiento como punto de partida.
          </div>
        </div>
      </div>

      <div>
        <div class="row items-center justify-between q-mb-sm">
          <span class="text-micro text-uppercase text-muted">Repartición de macros</span>
          <q-btn-toggle
            v-model="unit"
            :options="[
              { label: '%', value: '%' },
              { label: 'Gramos', value: 'g' },
            ]"
            dense
            no-caps
            unelevated
            toggle-color="primary"
            color="dark"
            text-color="muted"
          />
        </div>

        <div class="app-card column q-gutter-y-md">
          <div>
            <div class="row items-center justify-between q-mb-xs">
              <div class="row items-center q-gutter-xs">
                <q-icon name="set_meal" color="negative" size="18px" />
                <span class="text-body">Proteína</span>
              </div>
              <span class="text-body text-weight-bold">
                {{ displayValue(proteinPct, proteinGrams) }}
              </span>
            </div>
            <q-slider v-model="proteinPct" :min="0" :max="100" color="primary" />
          </div>

          <div>
            <div class="row items-center justify-between q-mb-xs">
              <div class="row items-center q-gutter-xs">
                <q-icon name="bakery_dining" color="warning" size="18px" />
                <span class="text-body">Carbohidratos</span>
              </div>
              <span class="text-body text-weight-bold">
                {{ displayValue(carbsPct, carbsGrams) }}
              </span>
            </div>
            <q-slider v-model="carbsPct" :min="0" :max="100" color="primary" />
          </div>

          <div>
            <div class="row items-center justify-between q-mb-xs">
              <div class="row items-center q-gutter-xs">
                <q-icon name="water_drop" color="warning" size="18px" />
                <span class="text-body">Grasas</span>
              </div>
              <span class="text-body text-weight-bold">{{ displayValue(fatPct, fatGrams) }}</span>
            </div>
            <q-slider v-model="fatPct" :min="0" :max="100" color="primary" />
          </div>

          <div class="surface-card row items-center justify-between">
            <span class="text-body text-muted">Total acumulado</span>
            <span class="text-body text-weight-bold" :class="totalPct === 100 ? 'text-positive' : 'text-negative'">
              {{ totalPct }}%
            </span>
          </div>
        </div>
      </div>

      <q-expansion-item
        icon="bolt"
        label="Recomendaciones"
        class="app-card"
        header-class="text-h2-section"
      >
        <div class="text-small text-muted q-pt-sm">
          Una repartición común es 30% proteína, 40% carbohidratos y 30% grasas. Ajusta según
          tu objetivo: más proteína en definición, más carbohidratos en volumen.
        </div>
      </q-expansion-item>

      <div class="column q-gutter-y-sm">
        <q-btn
          unelevated
          color="primary"
          no-caps
          icon="save"
          label="Guardar cambios"
          class="full-width"
          @click="save"
        />
        <q-btn flat no-caps color="muted" icon="restart_alt" label="Restablecer valores" @click="reset" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useMacroGoalPage } from './MacroGoalPage';

const {
  calorieGoal,
  proteinPct,
  carbsPct,
  fatPct,
  unit,
  totalPct,
  proteinGrams,
  carbsGrams,
  fatGrams,
  displayValue,
  save,
  reset,
} = useMacroGoalPage();
</script>
