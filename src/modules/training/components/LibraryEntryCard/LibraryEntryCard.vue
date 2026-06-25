<template>
  <div class="app-card row items-center no-wrap cursor-pointer" role="button" tabindex="0" @click="emit('open')">
    <div class="icon-tile">
      <q-icon name="grid_view" color="primary" size="20px" />
    </div>
    <div class="col q-ml-md">
      <div class="text-weight-medium">Mis ejercicios</div>
      <div class="text-caption text-muted">Explora tu biblioteca de movimientos</div>
    </div>
    <q-icon name="chevron_right" class="text-faint" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ open: [] }>();
</script>
