import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { sahityaDatabasePlugin } from './server/apiPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sahityaDatabasePlugin()],
})
