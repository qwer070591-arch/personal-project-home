import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Output goes to dist/ (the legacy static site was archived in .backups/ before the switch).
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true, chunkSizeWarningLimit: 700 },
})
