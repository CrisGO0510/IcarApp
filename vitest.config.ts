import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/types/**',
        'src/**/*.types.ts',
        'src/**/fixtures.ts',
        'src/**/*.mock.ts',
        'src/**/*.port.ts',
        'src/boot/**',
        'src/router/**',
        'src/stores/index.ts',
      ],
    },
  },
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
