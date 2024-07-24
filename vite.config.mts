import path from 'node:path';

import { defineConfig as defineViteConfig } from 'vite';
import viteDts from 'vite-plugin-dts';
import viteTsconfigPaths from 'vite-tsconfig-paths';

/**
 * Vite config
 *
 * @link https://vitejs.dev/config/
 */
export default defineViteConfig({
  base: '/',
  mode: 'production',
  plugins: [viteDts(), viteTsconfigPaths()],
  build: {
    target: ['node20', 'esnext'],
    outDir: path.join(__dirname, 'dist'),
    ssr: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts')
      },
      name: 'config'
    },
    rollupOptions: {
      external: ['@prisma/client', 'fastify-plugin'],
      output: {
        globals: {
          '@prisma/client': 'PrismaClient',
          'fastify-plugin': 'fp'
        }
      }
    }
  }
});
