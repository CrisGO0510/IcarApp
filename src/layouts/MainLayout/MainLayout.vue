<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="app-header">
      <q-toolbar>
        <q-btn
          v-if="showBack"
          flat
          round
          dense
          icon="arrow_back_ios_new"
          aria-label="Atrás"
          @click="goBack"
        />
        <q-btn
          v-else
          to="/"
          unelevated
          color="primary"
          text-color="white"
          icon="bolt"
          class="brand-btn"
          aria-label="Ir al dashboard"
        />
        <q-toolbar-title class="text-center text-weight-bold">{{ title }}</q-toolbar-title>
        <div id="toolbar-action" class="toolbar-action" />
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
import { useRoute, useRouter } from 'vue-router';
import AppTabBar from 'src/components/layout/AppTabBar/AppTabBar.vue';

const route = useRoute();
const router = useRouter();

const title = computed(() => (route.meta.title as string | undefined) ?? 'IcarApp');
const showBack = computed(() => route.meta.back === true);

function goBack(): void {
  if (window.history.length > 1) {
    router.back();
  } else {
    void router.push('/');
  }
}
</script>
