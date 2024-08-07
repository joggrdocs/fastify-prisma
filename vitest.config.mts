import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'json-summary', 'html'],
      all: true,
    },
    testTimeout: 15000,
  },
  // biome-ignore lint/suspicious/noExplicitAny: TypeScript bug where type depth exceeded
  plugins: [tsconfigPaths() as any],
});
