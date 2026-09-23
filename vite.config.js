import { defineConfig } from 'vite';
import { resolve } from 'path';
import { existsSync } from 'fs';

const pages = ['index.html', 'work.html', 'acting.html', 'practice.html', 'facilitation.html', 'about.html', 'work/huanbao.html'];
const input = {};
for (const p of pages) {
  const full = resolve(__dirname, p);
  if (existsSync(full)) {
    input[p.replace('.html', '').replace('/', '-')] = full;
  }
}

export default defineConfig({
  root: '.',
  base: './',
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input }
  }
});
