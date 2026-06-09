import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true
    },
    define: {
      'process.env': {
        NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_GATEWAY_URL: env.NEXT_PUBLIC_GATEWAY_URL,
        NEXT_PUBLIC_SECRET_KEY: env.NEXT_PUBLIC_SECRET_KEY,
        NEXT_PUBLIC_SIGNATURE_VERSION: env.NEXT_PUBLIC_SIGNATURE_VERSION,
        NEXT_PUBLIC_ENVIROMENT: env.NEXT_PUBLIC_ENVIROMENT
      }
    }
  }
})
