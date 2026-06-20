<template>
  <q-tabs
    v-model="tab"
    class="app-tab-bar text-muted"
    active-color="primary"
    indicator-color="transparent"
    dense
  >
    <q-tab name="entreno" icon="fitness_center" label="Entreno" no-caps />
    <q-tab name="nutricion" icon="restaurant" label="Nutrición" no-caps />
    <q-tab name="progreso" icon="show_chart" label="Progreso" no-caps />
    <q-tab name="ajustes" icon="settings" label="Ajustes" no-caps />
  </q-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tab = ref('entreno');
</script>
