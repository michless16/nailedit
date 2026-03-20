/**
 * @module vite.config
 * @description Configuration Vite pour l'application NailedIt.
 * Utilise le plugin React et configure les alias de chemin.
 */

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
