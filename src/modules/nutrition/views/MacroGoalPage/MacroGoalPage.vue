<template>
  <q-page class="q-pa-md">
    <div class="column q-gutter-y-lg page-content">
      <div>
        <div class="text-micro text-uppercase text-muted q-mb-sm">Presupuesto energético</div>
        <div class="app-card">
          <div class="row items-center q-gutter-sm q-mb-md">
            <q-icon name="local_fire_department" color="primary" size="22px" />
            <span class="text-h2-section">Gasto calórico diario</span>
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
            ¿Quieres un valor estimado?
            <q-btn
              flat
              dense
              no-caps
              size="sm"
              color="primary"
              label="Calcúlalo aquí"
              aria-label="Calcular valor estimado"
              @click="showTmbCalculator = true"
            />
          </div>
        </div>
      </div>

      <div>
        <div class="row items-center justify-between q-mb-sm">
          <span class="text-micro text-uppercase text-muted">Repartición de macros</span>
          <q-btn-toggle
            v-model="unit"
            :options="unitOptions"
            class="unit-toggle"
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
                <q-icon name="info_outline" size="14px" class="text-faint cursor-pointer">
                  <q-tooltip>1 g de proteína = {{ kcalPerGram.protein }} kcal</q-tooltip>
                </q-icon>
              </div>
              <div class="row items-center q-gutter-x-sm no-wrap">
                <span class="text-small text-faint">{{ proteinEquivalent }}</span>
                <q-input
                  v-model.number="proteinValue"
                  type="number"
                  min="0"
                  dense
                  borderless
                  class="macro-value-input"
                  input-class="text-body text-weight-bold text-right"
                  :suffix="unitSuffix"
                  aria-label="Proteína"
                />
              </div>
            </div>
            <q-slider
              v-model="proteinPct"
              :min="0"
              :max="100"
              :inner-max="proteinMax"
              :color="proteinColor"
              @pan="(phase) => onSliderPan('protein', phase)"
            />
          </div>

          <div>
            <div class="row items-center justify-between q-mb-xs">
              <div class="row items-center q-gutter-xs">
                <q-icon name="bakery_dining" color="warning" size="18px" />
                <span class="text-body">Carbohidratos</span>
                <q-icon name="info_outline" size="14px" class="text-faint cursor-pointer">
                  <q-tooltip>1 g de carbohidratos = {{ kcalPerGram.carbs }} kcal</q-tooltip>
                </q-icon>
              </div>
              <div class="row items-center q-gutter-x-sm no-wrap">
                <span class="text-small text-faint">{{ carbsEquivalent }}</span>
                <q-input
                  v-model.number="carbsValue"
                  type="number"
                  min="0"
                  dense
                  borderless
                  class="macro-value-input"
                  input-class="text-body text-weight-bold text-right"
                  :suffix="unitSuffix"
                  aria-label="Carbohidratos"
                />
              </div>
            </div>
            <q-slider
              v-model="carbsPct"
              :min="0"
              :max="100"
              :inner-max="carbsMax"
              :color="carbsColor"
              @pan="(phase) => onSliderPan('carbs', phase)"
            />
          </div>

          <div>
            <div class="row items-center justify-between q-mb-xs">
              <div class="row items-center q-gutter-xs">
                <q-icon name="water_drop" color="warning" size="18px" />
                <span class="text-body">Grasas</span>
                <q-icon name="info_outline" size="14px" class="text-faint cursor-pointer">
                  <q-tooltip>1 g de grasa = {{ kcalPerGram.fat }} kcal</q-tooltip>
                </q-icon>
              </div>
              <div class="row items-center q-gutter-x-sm no-wrap">
                <span class="text-small text-faint">{{ fatEquivalent }}</span>
                <q-input
                  v-model.number="fatValue"
                  type="number"
                  min="0"
                  dense
                  borderless
                  class="macro-value-input"
                  input-class="text-body text-weight-bold text-right"
                  :suffix="unitSuffix"
                  aria-label="Grasas"
                />
              </div>
            </div>
            <q-slider
              v-model="fatPct"
              :min="0"
              :max="100"
              :inner-max="fatMax"
              :color="fatColor"
              @pan="(phase) => onSliderPan('fat', phase)"
            />
          </div>

          <div class="surface-card row items-center justify-between">
            <span class="text-body text-muted">Total acumulado</span>
            <span
              class="text-body text-weight-bold"
              :class="totalPct === 100 ? 'text-positive' : 'text-negative'"
            >
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
          Una repartición común es 30% proteína, 40% carbohidratos y 30% grasas. Ajusta según tu
          objetivo: más proteína en definición, más carbohidratos en volumen.
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
        <q-btn
          flat
          no-caps
          color="muted"
          icon="restart_alt"
          label="Restablecer valores"
          @click="reset"
        />
      </div>
    </div>

    <TmbCalculatorDialog v-model="showTmbCalculator" @apply="applyEstimate" />
  </q-page>
</template>

<script setup lang="ts">
import TmbCalculatorDialog from '../../components/TmbCalculatorDialog/TmbCalculatorDialog.vue';
import { useMacroGoalPage } from './MacroGoalPage';

const {
  calorieGoal,
  proteinPct,
  carbsPct,
  fatPct,
  unit,
  unitOptions,
  unitSuffix,
  totalPct,
  kcalPerGram,
  proteinValue,
  carbsValue,
  fatValue,
  proteinEquivalent,
  carbsEquivalent,
  fatEquivalent,
  proteinMax,
  carbsMax,
  fatMax,
  proteinColor,
  carbsColor,
  fatColor,
  onSliderPan,
  save,
  reset,
  showTmbCalculator,
  applyEstimate,
} = useMacroGoalPage();
</script>
