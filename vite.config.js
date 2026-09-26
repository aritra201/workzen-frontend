import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/country-codes': {
        target: 'https://lawsikho.com',
        changeOrigin: true,
        rewrite: () => '/api/v1/country-code',
      },
    },
  },
});
