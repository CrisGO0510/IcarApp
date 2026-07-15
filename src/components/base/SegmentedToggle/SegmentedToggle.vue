<template>
  <div class="segmented" :style="{ '--segment-count': options.length }">
    <div class="segmented__pill" :style="pillStyle" />
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="segmented__option"
      :class="{ 'segmented__option--active': option.value === model }"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
import { computed } from 'vue';

const PERCENT_PER_STEP = 100;

const model = defineModel<T>({ required: true });

const props = defineProps<{
  options: ReadonlyArray<{ label: string; value: T }>;
}>();

const activeIndex = computed(() => {
  const index = props.options.findIndex((option) => option.value === model.value);
  return Math.max(0, index);
});

const pillStyle = computed(() => ({
  transform: `translateX(${activeIndex.value * PERCENT_PER_STEP}%)`,
}));
</script>
