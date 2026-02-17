import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  define: {
    'import.meta.env.VITE_CONVEX_SITE_URL': JSON.stringify(
      process.env.VITE_CONVEX_SITE_URL || 'https://your-convex-deployment.convex.site'
    ),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReleaseDock',
      formats: ['iife'],
      fileName: () => 'releasedock.js',
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
