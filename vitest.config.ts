import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts', '**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '**/types.ts',
        '**/*.d.ts',
        '**/__mocks__/**',
      ],
    },
    // Handle CSS and other asset imports
    css: true,
    // For better test output
    silent: false,
    logHeapUsage: false,
    // Watch mode configuration
    watch: false,
    // Timeout for tests (in milliseconds)
    testTimeout: 10000,
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@/': './*',
    },
  },
})