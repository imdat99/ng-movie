/// <reference types="vitest" />

import { defineConfig, loadEnv } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import * as path from 'path';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    root: 'src',
    publicDir: 'assets',
    build: {
      outDir: `../dist`,
      emptyOutDir: true,
      target: 'es2022',
    },
    resolve: {
      mainFields: ['module'],
      alias: {
        '@app': path.resolve(__dirname, './src/app'),
      },
    },
    plugins: [
      angular({
        inlineStylesExtension: 'scss',
      }),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['test.ts'],
      include: ['**/*.spec.ts'],
      cache: {
        dir: `../node_modules/.vitest`,
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  });
};
