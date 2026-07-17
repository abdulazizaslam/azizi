import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Relative base so the built app works under GitHub Pages (/azizi/).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
