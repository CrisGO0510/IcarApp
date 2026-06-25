<template>
  <div>
    <FieldLabel>UNIDAD DE MEDIDA</FieldLabel>
    <q-btn-toggle
      :model-value="modelValue"
      spread
      no-caps
      toggle-color="primary"
      color="dark"
      text-color="muted"
      :options="[
        { label: 'Kilogramos (kg)', value: 'metric' },
        { label: 'Libras (lbs)', value: 'imperial' },
      ]"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import FieldLabel from 'src/components/base/FieldLabel/FieldLabel.vue';
import type { UnitSystem } from '../../types/profile.types';

defineProps<{
  modelValue: UnitSystem;
}>();

defineEmits<{
  'update:modelValue': [value: UnitSystem];
}>();
</script>
