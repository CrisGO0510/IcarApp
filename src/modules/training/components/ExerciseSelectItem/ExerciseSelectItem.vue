<template>
  <div class="app-card row items-center no-wrap cursor-pointer" role="button" tabindex="0" @click="emit('toggle')">
    <q-icon
      v-if="handle"
      name="drag_indicator"
      size="20px"
      class="drag-handle text-faint q-mr-sm"
      @click.stop
    />
    <div class="icon-tile">
      <q-icon name="fitness_center" color="primary" size="20px" />
    </div>
    <div class="col q-ml-md">
      <div class="text-weight-medium">{{ exercise.name }}</div>
    </div>
    <q-icon
      :name="selected ? 'check_circle' : 'radio_button_unchecked'"
      color="primary"
      :class="{ 'text-faint': !selected }"
      size="24px"
    />
  </div>
</template>

<script setup lang="ts">
import type { Exercise } from '../../types/training.types';

defineProps<{ exercise: Exercise; selected: boolean; handle?: boolean }>();

const emit = defineEmits<{ toggle: [] }>();
</script>
