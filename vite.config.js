import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
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
