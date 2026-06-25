<template>
  <q-card flat class="app-card">
    <div class="row items-center no-wrap">
      <div class="icon-tile icon-tile--lg">
        <q-icon :name="icon" color="primary" size="22px" />
      </div>
      <div class="col q-ml-md">
        <div class="text-caption text-uppercase text-muted">{{ label }}</div>
        <div class="row items-baseline q-gutter-x-sm">
          <span class="text-h6 text-weight-bold">
            {{ value }}<template v-if="unit"> {{ unit }}</template>
          </span>
          <span v-if="delta" class="text-caption text-weight-medium text-muted">{{ delta }}</span>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
}>();
</script>

