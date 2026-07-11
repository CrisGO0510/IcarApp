import { computed, onMounted, ref } from 'vue';
import type { ComputedRef, Ref, WritableComputedRef } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useNutritionStore } from '../../stores/nutrition.store';
import { useProfileStore } from 'src/modules/profile/stores/profile.store';
import type { MacroGoalInput } from '../../types/nutrition.types';

const DEFAULTS = { calories: 2500, protein: 30, carbs: 40, fat: 30 };
const KCAL_PER_GRAM = { protein: 4, carbs: 4, fat: 9 } as const;
const UNIT_OPTIONS: Array<{ label: string; value: '%' | 'g' }> = [
  { label: '%', value: '%' },
  { label: 'gr', value: 'g' },
];
const PCT_MIN = 0;
const PCT_MAX = 100;

type MacroKey = keyof typeof KCAL_PER_GRAM;
type PanPhase = 'start' | 'end';

export function useMacroGoalPage() {
  const router = useRouter();
  const $q = useQuasar();
  const store = useNutritionStore();
  const profileStore = useProfileStore();

  const calorieGoal = ref<number>(DEFAULTS.calories);
  const proteinPctRef = ref<number>(DEFAULTS.protein);
  const carbsPctRef = ref<number>(DEFAULTS.carbs);
  const fatPctRef = ref<number>(DEFAULTS.fat);
  const unit = ref<'%' | 'g'>('%');
  const showTmbCalculator = ref(false);

  function applyEstimate(kcal: number): void {
    calorieGoal.value = kcal;
  }

  const totalPct = computed(() => proteinPctRef.value + carbsPctRef.value + fatPctRef.value);

  function toGrams(pct: number, kcalPerGram: number): number {
    return Math.round(((calorieGoal.value || 0) * pct) / PCT_MAX / kcalPerGram);
  }
  const proteinGrams = computed(() => toGrams(proteinPctRef.value, KCAL_PER_GRAM.protein));
  const carbsGrams = computed(() => toGrams(carbsPctRef.value, KCAL_PER_GRAM.carbs));
  const fatGrams = computed(() => toGrams(fatPctRef.value, KCAL_PER_GRAM.fat));

  function availablePct(pct: Ref<number>): number {
    return PCT_MAX - (totalPct.value - pct.value);
  }

  function clampPct(value: number, max: number): number {
    if (!Number.isFinite(value)) return PCT_MIN;
    return Math.min(max, Math.max(PCT_MIN, Math.round(value)));
  }

  function pctModel(pct: Ref<number>): WritableComputedRef<number> {
    return computed({
      get: () => pct.value,
      set: (value) => {
        pct.value = clampPct(value, availablePct(pct));
      },
    });
  }

  function macroModel(pct: Ref<number>, kcalPerGram: number): WritableComputedRef<number> {
    return computed({
      get: () => (unit.value === '%' ? pct.value : toGrams(pct.value, kcalPerGram)),
      set: (value) => {
        pct.value = clampPct(
          unit.value === '%'
            ? value
            : (value * kcalPerGram * PCT_MAX) / (calorieGoal.value || DEFAULTS.calories),
          availablePct(pct),
        );
      },
    });
  }

  const proteinPct = pctModel(proteinPctRef);
  const carbsPct = pctModel(carbsPctRef);
  const fatPct = pctModel(fatPctRef);

  const proteinValue = macroModel(proteinPctRef, KCAL_PER_GRAM.protein);
  const carbsValue = macroModel(carbsPctRef, KCAL_PER_GRAM.carbs);
  const fatValue = macroModel(fatPctRef, KCAL_PER_GRAM.fat);

  const proteinMax = computed(() => availablePct(proteinPctRef));
  const carbsMax = computed(() => availablePct(carbsPctRef));
  const fatMax = computed(() => availablePct(fatPctRef));

  const panningMacro = ref<MacroKey | null>(null);

  function onSliderPan(macro: MacroKey, phase: PanPhase): void {
    panningMacro.value = phase === 'start' ? macro : null;
  }

  function sliderColor(
    macro: MacroKey,
    pct: Ref<number>,
    max: ComputedRef<number>,
  ): ComputedRef<string> {
    return computed(() =>
      panningMacro.value === macro && max.value < PCT_MAX && pct.value >= max.value
        ? 'negative'
        : 'primary',
    );
  }

  const proteinColor = sliderColor('protein', proteinPctRef, proteinMax);
  const carbsColor = sliderColor('carbs', carbsPctRef, carbsMax);
  const fatColor = sliderColor('fat', fatPctRef, fatMax);

  const unitSuffix = computed(() => (unit.value === '%' ? '%' : 'g'));

  function equivalentLabel(
    pct: Ref<number>,
    grams: ComputedRef<number>,
  ): ComputedRef<string> {
    return computed(() => (unit.value === '%' ? `${grams.value}g` : `${pct.value}%`));
  }

  const proteinEquivalent = equivalentLabel(proteinPctRef, proteinGrams);
  const carbsEquivalent = equivalentLabel(carbsPctRef, carbsGrams);
  const fatEquivalent = equivalentLabel(fatPctRef, fatGrams);

  async function save(): Promise<void> {
    if (totalPct.value !== 100) {
      $q.notify({ type: 'warning', message: 'La repartición de macros debe sumar 100%.' });
      return;
    }

    const input: MacroGoalInput = {
      date: store.date,
      calorieGoal: calorieGoal.value || 0,
      proteinGoal: proteinGrams.value,
      carbohydrateGoal: carbsGrams.value,
      fatGoal: fatGrams.value,
    };

    try {
      await store.saveGoal(input);
      $q.notify({ type: 'positive', message: 'Meta de macros guardada.' });
      await router.push('/nutricion');
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error instanceof Error ? error.message : 'No se pudo guardar la meta.',
      });
    }
  }

  function reset(): void {
    calorieGoal.value = DEFAULTS.calories;
    proteinPctRef.value = DEFAULTS.protein;
    carbsPctRef.value = DEFAULTS.carbs;
    fatPctRef.value = DEFAULTS.fat;
  }

  onMounted(async () => {
    await profileStore.loadProfile();
    await store.loadGoal();
    const goal = store.goal;
    if (goal) {
      calorieGoal.value = goal.calorieGoal;
      const cal = goal.calorieGoal || 1;
      proteinPctRef.value = Math.round(((goal.proteinGoal * KCAL_PER_GRAM.protein) / cal) * PCT_MAX);
      carbsPctRef.value = Math.round(((goal.carbohydrateGoal * KCAL_PER_GRAM.carbs) / cal) * PCT_MAX);
      fatPctRef.value = Math.round(((goal.fatGoal * KCAL_PER_GRAM.fat) / cal) * PCT_MAX);
    }
  });

  return {
    calorieGoal,
    proteinPct,
    carbsPct,
    fatPct,
    unit,
    unitOptions: UNIT_OPTIONS,
    unitSuffix,
    totalPct,
    kcalPerGram: KCAL_PER_GRAM,
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
  };
}
