import type { CapacitorConfig } from '@capacitor/cli';

const liveReloadUrl = process.env.CAP_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.crisg0510.icar',
  appName: 'IcarApp',
  webDir: 'dist',
  ...(liveReloadUrl && {
    server: {
      url: liveReloadUrl,
      cleartext: true,
    },
  }),
};

export default config;
