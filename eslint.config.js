const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ['@joggr/eslint-config'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  },
  ignorePatterns: [
    'dist',
    'node_modules',
    'coverage',
    'scripts',
    'vite.config.mts',
    'vitest.config.mts',
    'eslint.config.js'
  ]
};

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended
});

module.exports = [...compat.config(config)];
