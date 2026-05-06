<template>
  <div>
    <div class="text-caption text-grey-5 q-mb-xs">UNIDAD DE MEDIDA</div>
    <q-btn-toggle
      :model-value="modelValue"
      spread
      no-caps
      toggle-color="primary"
      color="dark"
      text-color="grey-4"
      :options="[
        { label: 'Kilogramos (kg)', value: 'metric' },
        { label: 'Libras (lbs)', value: 'imperial' },
      ]"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { UnitSystem } from '../../types/profile.types';

defineProps<{
  modelValue: UnitSystem;
}>();

defineEmits<{
  'update:modelValue': [value: UnitSystem];
}>();
</script>
