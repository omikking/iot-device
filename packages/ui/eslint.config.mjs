import reactConfig from '@gsp/eslint-config/eslint.config.react.mjs';

/**
 * ESLint flat config for the UI package
 * 
 * Extends the shared React configuration for component libraries.
 * Includes relaxed rules suitable for UI component packages.
 */

export default [
  ...reactConfig,
];