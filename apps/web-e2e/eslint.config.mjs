import nx from '@nx/eslint-plugin';
import playwright from 'eslint-plugin-playwright';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  {
    files: ['**/*.ts', '**/*.js'],
    plugins: {
      playwright,
    },
    rules: {
      ...playwright.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'off', // Allow console.log in E2E tests for debugging
      'playwright/expect-expect': 'off', // E2E tests often have complex flows with cleanup
    },
  },
  {
    ignores: ['playwright-report/', 'test-results/'],
  },
];