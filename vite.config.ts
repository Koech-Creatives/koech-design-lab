// eslint-disable
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Debug logger plugin (development only)
function debugLogger() {
  return {
    name: 'debug-logger',
    configureServer(server: any) {
      // Only enable in development
      if (process.env.NODE_ENV === 'development') {
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
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react(), debugLogger()],
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: !isProduction, // Only generate sourcemaps in development
      minify: isProduction ? 'esbuild' : false,
      target: 'es2015',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react'],
            utils: ['html2canvas']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    
    // Server configuration
    server: {
      port: 5173,
      host: true, // Allow external connections
      strictPort: false
    },
    
    // Preview configuration (for production preview)
    preview: {
      port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
      host: '0.0.0.0',
      strictPort: true
    },
    
    // Optimization
    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['react', 'react-dom', '@supabase/supabase-js', '@directus/sdk']
    },
    
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    },
    
    // Base URL for assets
    base: '/',
    
    // CSS configuration
    css: {
      postcss: './postcss.config.js'
    }
  };
});
