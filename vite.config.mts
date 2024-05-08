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
  plugins: [viteDts(), viteTsconfigPaths()],
  build: {
    outDir: path.join(__dirname, 'dist'),
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
      },
      name: 'config',
    },
  },
});
