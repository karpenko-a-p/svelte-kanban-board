import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import { importX } from 'eslint-plugin-import-x';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...ts.configs.stylistic,
  ...svelte.configs.recommended,
  prettier,
  ...svelte.configs.prettier,
  {
    ignores: ['dist/', 'build/', 'node_modules/', 'coverage/', '*.min.js']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.svelte,
        ...globals.bunBuiltin
      }
    },
    plugins: {
      'import-x': importX
    },
    settings: {
      'import-x/internal-regex': '^#/'
    },
    rules: {
      // common
      'no-undef': 'off',
      'no-console': 'warn',

      // svelte
      'svelte/require-each-key': 'off',
      'svelte/no-navigation-without-resolve': 'off',

      // typescript-eslint
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: false
        }
      ],

      // import
      'import-x/no-duplicates': 'error',
      'import-x/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [{ pattern: '#**', group: 'external', position: 'after' }],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    }
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: ts.parser
      }
    }
  }
);
