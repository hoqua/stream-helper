import nx from '@nx/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  unicorn.configs.recommended,
  prettierConfig,
  {
    ignores: ['**/dist', '**/*.config.js', '**/*.config.ts', '**/*.config.mjs', '**/out-tsc'],
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {
      'prettier/prettier': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-string-raw': 'off',
    },
  },
  {
    files: ['**/*.json'],
    rules: {
      'unicorn/prevent-abbreviations': 'off',
    },
  },
];
