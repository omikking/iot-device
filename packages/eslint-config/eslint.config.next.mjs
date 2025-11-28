import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import next from '@next/eslint-plugin-next';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import turbo from 'eslint-config-turbo';

/**
 * ESLint flat config for Next.js applications
 * 
 * This config is designed for Next.js applications with React and TypeScript.
 * Includes React, React Hooks, Next.js specific rules, and Turbo integration.
 */

const isProduction = process.env.NODE_ENV === 'production';

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
        node: true,
        browser: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      '@next/next': next,
      prettier,
    },
    rules: {
      // TypeScript and React recommended rules
      ...typescript.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      
      // Prettier integration
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      
      // Custom rules for Next.js apps
      'import/no-default-export': 'off', // Next.js uses default exports
      'react/react-in-jsx-scope': 'off', // Next.js doesn't need React import
      'react/prop-types': 'off', // Using TypeScript for prop validation
      
      // Custom unused vars rule for development
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': isProduction ? 'error' : 'warn',
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
  
  // Turbo configuration
  // TODO: Broken? 
  // ...turbo,
  
  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.next/',
      '.eslintrc.js',
      'eslint.config.js',
    ],
  },
];