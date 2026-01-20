import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { 
    files: ['**/*.{js,mjs,cjs}'], 
    plugins: { js }, 
    extends: ['js/recommended'], 
    languageOptions: {
      globals: { ...globals.node, ...globals.commonjs },
    },
    rules: {
      'no-console': 'off',
      'no-control-regex': 'off',
      'no-var': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'indent': ['error', 2, { 'SwitchCase': 1 }],
    },
  },
  { 
    files: ['**/*.js'], 
    languageOptions: { 
      sourceType: 'commonjs',
    },
  },
  {
    files: ['**/*.{test,spec}.js', '**/__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.jest,
      },
    },
  },
]);
