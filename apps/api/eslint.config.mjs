import nodeConfig from '@gsp/eslint-config/eslint.config.node.mjs';

/**
 * ESLint flat config for the API application
 * 
 * Extends the shared Node.js configuration for NestJS applications.
 * Includes the custom GraphQL import restriction rule.
 */

export default [
  ...nodeConfig,
];