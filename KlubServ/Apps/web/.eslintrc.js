module.exports = {
  extends: [
    'next/core-web-vitals',
  ],
  rules: {
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'warn',
    'no-undef': 'warn',
    'react/no-unescaped-entities': 'warn',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/alt-text': 'warn',
    'no-useless-escape': 'warn',
    'no-redeclare': 'warn',
    'no-dupe-else-if': 'warn',
  },
  env: {
    jest: true,
  },
}; 