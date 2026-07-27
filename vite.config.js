import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function chatProxyConfig(apiBase, agentId, apiKey) {
  return {
    '/api/chat/messages': {
      target: apiBase,
      changeOrigin: true,
      timeout: 120000,
      proxyTimeout: 120000,
      rewrite: (path) => {
        const queryIndex = path.indexOf('?');
        const query = queryIndex >= 0 ? path.slice(queryIndex) : '';
        return `/api/bots/${agentId}/messages${query}`;
      },
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq, req) => {
          if (apiKey) {
            proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
          }
          const query = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
          proxyReq.path = `/api/bots/${agentId}/messages${query}`;
        });
        proxy.on('error', (err, req) => {
          console.error('[chat-proxy]', req.method, req.url, err.message);
        });
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.CHATBOT_API_BASE_URL || 'https://mau-call-center.onrender.com';
  const agentId = env.CHATBOT_AGENT_ID || 'agent_2102692c-a4b6-4c98-9280-0490719442b7';
  const apiKey = env.CHATBOT_API_KEY || '';
  const proxy = chatProxyConfig(apiBase, agentId, apiKey);

  if (!apiKey) {
    console.warn('[vite] CHATBOT_API_KEY is missing — chat proxy requests will fail upstream auth');
  }

  return {
    plugins: [react()],
    server: {
      host: 'localhost',
      port: 5173,
      strictPort: true,
      proxy,
    },
    preview: {
      host: 'localhost',
      port: 4173,
      strictPort: true,
      proxy,
    },
  };
});
