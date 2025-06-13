// eslint-disable
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Debug logger plugin (development only)
function debugLogger() {
  return {
    name: 'debug-logger',
    configureServer(server: any) {
      server.middlewares.use('/__debug', (req: any, res: any, next: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const json = JSON.parse(body);
              // eslint-disable-next-line no-console
              console.log('\n🪲  Front-end Error Log:', JSON.stringify(json, null, 2));
            } catch (e) {
              // eslint-disable-next-line no-console
              console.warn('Failed to parse debug payload');
            }
            res.statusCode = 204;
            res.end();
          });
        } else {
          next();
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), debugLogger()],
  optimizeDeps: {
    exclude: ['lucide-react', '@resvg/resvg-js'],
  },
});
