module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'prefer-const': 'error',
    'no-var': 'error',
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '.next/',
    '.turbo/',
    '*.config.js',
    '*.config.ts',
  ],
}; 