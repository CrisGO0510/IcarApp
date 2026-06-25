<template>
  <div>
    <FieldLabel>DESCANSO POR SERIE</FieldLabel>
    <div class="row q-gutter-sm q-mb-sm">
      <q-btn
        v-for="preset in REST_TIME_PRESETS"
        :key="preset"
        :label="`${preset}s`"
        :outline="selectedPreset !== preset"
        :color="selectedPreset === preset ? 'primary' : 'secondary'"
        :text-color="selectedPreset === preset ? 'white' : 'muted'"
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
      outlined
      suffix="seg"
    />
  </div>
</template>

<script setup lang="ts">
import FieldLabel from 'src/components/base/FieldLabel/FieldLabel.vue';
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
