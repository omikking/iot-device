import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/**
 * ESLint flat config for React libraries
 *
 * This config is designed for React component libraries and packages.
 * Includes accessibility rules and relaxed rules for UI component libraries.
 */

export default [
  // TypeScript and React configuration
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
        browser: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier,
    },
    rules: {
      // TypeScript and React recommended rules
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      // Prettier integration
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // Relaxed rules for UI libraries
      'import/no-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/order': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-sort-props': 'off',
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/react-in-jsx-scope': 'off', // Modern React doesn't need this
      'react/no-unstable-nested-components': [
        'warn',
        {
          allowAsProps: true,
        },
      ],
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'jsx-a11y/heading-has-content': 'off',
      'no-implicit-coercion': 'off',
      'object-shorthand': 'off',
      'react/jsx-no-leaked-render': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },

  // Node.js config files
  {
    files: ['*.config.js', '*.config.mjs'],
    languageOptions: {
      globals: {
        node: true,
      },
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.eslintrc.js',
      'eslint.config.js',
      '**/*.css',
    ],
  },
];
