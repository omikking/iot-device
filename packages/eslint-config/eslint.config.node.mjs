import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/**
 * ESLint flat config for Node.js/NestJS applications
 * 
 * This config is designed for backend Node.js applications,
 * particularly NestJS applications with TypeScript.
 */

export default [
  // TypeScript configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        node: true,
        jest: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
    },
    rules: {
      // TypeScript recommended rules
      ...typescript.configs.recommended.rules,
      
      // Custom TypeScript rules for Node.js/NestJS
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // Consider re-enabling?
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      
      // Prettier integration
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      
      // Custom GraphQL import restriction rule
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportDeclaration[source.value=/graphql-types/] > ImportSpecifier',
          message: 'Named imports are not allowed for "graphql-types" imports. Use "import * as GraphQLTypes [...]" instead.'
        }
      ],
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
    ],
  },
];