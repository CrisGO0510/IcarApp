<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent">
      <q-toolbar>
        <q-toolbar-title class="text-center text-weight-bold">{{ title }}</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="app-footer">
      <AppTabBar />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppTabBar from 'src/components/layout/AppTabBar/AppTabBar.vue';

const route = useRoute();
const title = computed(() => (route.meta.title as string | undefined) ?? 'IcarApp');
</script>

<style scoped lang="scss">
.app-footer {
  background: $surface;
}
</style>
