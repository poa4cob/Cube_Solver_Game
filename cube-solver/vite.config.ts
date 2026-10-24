import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // cubing.js uses module workers, where Vite's DOM-based preload helper cannot run.
    modulePreload: false,
    cssCodeSplit: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'cubing',
              test: (id) =>
                id.includes('node_modules/cubing/') &&
                !/(?:search-worker-entry|chunk-BHVTDDUY)\.js$/.test(id),
            },
            { name: 'cubing-worker', test: /chunk-BHVTDDUY\.js/ },
          ],
        },
      },
    },
  },
})
