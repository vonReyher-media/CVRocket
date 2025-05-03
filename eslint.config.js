// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // 🔒 Ignorieren von build-Ordnern
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
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
        project: './tsconfig.base.json', // zentraler Typing-Root
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
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // 🧱 Per-Projekt TypeScript-Config
  // {
  //     files: ['apps/demo/**/*.{ts,tsx}'],
  //     languageOptions: {
  //         parserOptions: {
  //             project: './apps/demo/tsconfig.eslint.json',
  //         },
  //     },
  // },
  // {
  //     files: ['packages/core/**/*.{ts,tsx}'],
  //     languageOptions: {
  //         parserOptions: {
  //             project: './packages/core/tsconfig.json',
  //         },
  //     },
  // },
];
