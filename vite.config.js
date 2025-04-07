import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Add this to help resolve node_modules assets
      'rc-slider': path.resolve(__dirname, 'node_modules/rc-slider'),
    },
  },
  // This ensures CSS imports from node_modules work correctly
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
