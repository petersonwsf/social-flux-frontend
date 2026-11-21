import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  // Em desenvolvimento o navegador fala só com o Vite (mesma origem, necessário para os cookies HttpOnly);
  // /auth, /api e /media (avatares e imagens de postagem) são encaminhados ao gateway do docker compose (Caddy).
  const gateway = env.VITE_DEV_PROXY_TARGET || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/auth': { target: gateway },
        '/api': { target: gateway },
        '/media': { target: gateway },
        '/.well-known': { target: gateway },
      },
    },
  }
})
