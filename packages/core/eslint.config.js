import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 🔒 Ignorieren von build-Ordnern
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.config./*'],
  },

  // 🔧 Basiskonfigurationen
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,

  // 🧠 Hauptregelblock
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: '../../tsconfig.base.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // 🧹 React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // 🧠 Hooks
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',

      // 🧼 TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',

      // 🛑 Verhindere Namespace-Imports aus externen Paketen
      'import/no-namespace': ['error', { allow: [] }],

      // 🛑 Explizit verbotene interne Module
      'import/no-internal-modules': [
        'error',
        {
          allow: [
            '**', // alles außer:
            '!class-variance-authority/types',
          ],
        },
      ],

      // ✅ Import-Optimierung & Sortierung
      'import/no-duplicates': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
