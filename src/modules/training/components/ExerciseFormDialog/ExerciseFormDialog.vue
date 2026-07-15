<template>
  <q-dialog v-model="open">
    <q-card class="app-card form-dialog">
      <div class="text-h6 text-weight-bold q-mb-md">Nuevo ejercicio</div>

      <q-input
        v-model="name"
        label="Nombre"
        dense
        autofocus
        :error="hasError"
        :error-message="errorMessage"
        @keyup.enter="submit"
      />

      <div class="row justify-end q-gutter-sm q-mt-lg">
        <ActionButton :kind="ACTION_KIND.CANCEL" label="Cancelar" :block="false" @click="open = false" />
        <q-btn unelevated color="primary" no-caps label="Agregar" @click="submit" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ActionButton from 'src/components/base/ActionButton/ActionButton.vue';
import { ACTION_KIND } from 'src/components/base/ActionButton/ActionButton';

const open = defineModel<boolean>({ required: true });

const emit = defineEmits<{ create: [name: string] }>();

const name = ref('');
const hasError = ref(false);

const errorMessage = 'El nombre es obligatorio.';

watch(open, (value) => {
  if (value) {
    name.value = '';
    hasError.value = false;
  }
});

function submit(): void {
  if (!name.value.trim()) {
    hasError.value = true;
    return;
  }
  emit('create', name.value);
}
</script>
