<template>
  <div
    v-if="running"
    class="rest-timer-widget"
    :class="{
      'rest-timer-widget--dragging': dragging,
      'rest-timer-widget--snapping': snapping,
    }"
    :style="style"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <q-icon name="timer" size="sm" class="rest-timer-widget__icon" />
    <div class="rest-timer-widget__info">
      <div class="rest-timer-widget__label">Descanso</div>
      <div class="rest-timer-widget__value">{{ label }}</div>
    </div>
    <q-btn
      round
      dense
      flat
      icon="close"
      class="rest-timer-widget__close"
      aria-label="Cancelar descanso"
      @pointerdown.stop
      @click="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { useRestTimerWidget } from './RestTimerWidget';

const {
  running,
  label,
  style,
  dragging,
  snapping,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onCancel,
} = useRestTimerWidget();
</script>
