<template>
  <q-card flat class="app-card">
    <div class="row items-center justify-between no-wrap">
      <span class="text-caption text-uppercase text-muted">{{ label }}</span>
      <q-btn
        v-if="actionIcon"
        :icon="actionIcon"
        round
        unelevated
        size="sm"
        color="primary"
        @click="emit('action')"
      />
    </div>
    <div class="row items-baseline q-gutter-xs q-mt-sm">
      <span class="text-display">{{ value }}</span>
      <span v-if="unit" class="text-caption text-uppercase text-primary text-weight-bold">
        {{ unit }}
      </span>
    </div>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  unit?: string;
  actionIcon?: string;
}>();

const emit = defineEmits<{ action: [] }>();
</script>
