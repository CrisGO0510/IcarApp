import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar, Notify, Dialog } from 'quasar';
import { Capacitor } from '@capacitor/core';
import { registerSW } from 'virtual:pwa-register';

import 'quasar/src/css/index.sass';
import '@quasar/extras/material-icons/material-icons.css';
import './css/app.scss';

import App from './App.vue';
import router from './router';
import { configureHardwareBackButton } from './core/native/hardwareBackButton';

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
  },
  config: {
    dark: true,
  },
});
app.use(createPinia());
app.use(router);

configureHardwareBackButton();

if (!Capacitor.isNativePlatform()) {
  registerSW();
}

if (import.meta.env.DEV) {
  const { seedFromExampleBackup } = await import('./core/backup/devSeed');
  await seedFromExampleBackup();
}

app.mount('#app');
