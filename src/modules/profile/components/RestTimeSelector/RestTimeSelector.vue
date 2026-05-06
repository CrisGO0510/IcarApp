<template>
  <div>
    <div class="text-caption text-grey-5 q-mb-xs">DESCANSO POR SERIE</div>
    <div class="row q-gutter-sm q-mb-sm">
      <q-btn
        v-for="preset in REST_TIME_PRESETS"
        :key="preset"
        :label="`${preset}s`"
        :outline="selectedPreset !== preset"
        :color="selectedPreset === preset ? 'primary' : 'grey-8'"
        :text-color="selectedPreset === preset ? 'white' : 'grey-4'"
        dense
        no-caps
        class="col"
        @click="selectPreset(preset)"
      />
    </div>
    <q-input
      v-model.number="customRestTime"
      placeholder="Valor personalizado (seg)"
      type="number"
      dense
      dark
      outlined
      suffix="seg"
    />
  </div>
</template>

<script setup lang="ts">
import { useRestTimeSelector } from './RestTimeSelector';

defineProps<{
  modelValue?: number | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number | null];
}>();

const { selectedPreset, customRestTime, REST_TIME_PRESETS, selectPreset } =
  useRestTimeSelector(emit);
</script>
