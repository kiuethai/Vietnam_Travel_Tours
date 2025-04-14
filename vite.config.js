import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'

export default defineConfig({
  define: {
    'process.env': process.env
  },
  plugins: [
    react(),
    {
      ...rollupNodePolyFill(),
      enforce: 'pre'
    }
  ],
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
  build: {
    rollupOptions: {
      plugins: [
        rollupNodePolyFill()
      ]
    }
  }
});
