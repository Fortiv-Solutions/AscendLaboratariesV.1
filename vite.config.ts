import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Serves api/realtime-session.ts during `vite dev`, so voice mode works
 * locally without `vercel dev`. On Vercel the file runs as a serverless function.
 */
function realtimeSessionDevApi(): Plugin {
  return {
    name: 'realtime-session-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/realtime-session', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/realtime-session.ts');
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value);
          }
          const request = new Request(`http://${req.headers.host}/api/realtime-session`, {
            method: req.method,
            headers,
          });
          const response: Response =
            req.method === 'POST' ? await mod.POST(request) : new Response(null, { status: 405 });
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(await response.text());
        } catch (error) {
          console.error('[realtime-session] dev handler failed:', error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'dev_handler_failed' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Expose server-only secrets from .env to the dev API handler (never to the client bundle)
  Object.assign(process.env, loadEnv(mode, process.cwd(), ['OPENAI_', 'ALLOWED_ORIGINS', 'CHAT_API_PROXY_TARGET']));

  return {
    plugins: [react(), realtimeSessionDevApi()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        // FastAPI chat backend: `uvicorn app.main:app --reload --port 8000` in backend/
        '/api/chat': {
          target: process.env.CHAT_API_PROXY_TARGET || 'http://localhost:8000',
          changeOrigin: true
        }
      }
    }
  };
});
