module.exports = {
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  workerIdleMemoryLimit: '512MB',
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic'
            }
          }
        }
      }
    ]
  }
};
