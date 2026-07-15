<template>
  <q-btn
    flat
    no-caps
    :color="ACTION_COLOR"
    :icon="icon"
    :label="label"
    class="action-btn--danger"
    :class="{ 'full-width': block }"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ACTION_KIND, ACTION_COLOR, DELETE_ICON, type ActionKind } from './ActionButton';

const props = withDefaults(defineProps<{ kind: ActionKind; label: string; block?: boolean }>(), {
  block: true,
});

const icon = computed(() => (props.kind === ACTION_KIND.DELETE ? DELETE_ICON : undefined));
</script>
