// UPDATE-TODO: Unify codemod changes with eslint config...
import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import nextConfig from '@gsp/eslint-config/eslint.config.next.mjs';

/**
 * ESLint flat config for the Web application
 * 
 * Extends the shared Next.js configuration for React applications.
 */

export default [
    ...next, ...nextCoreWebVitals, ...nextTypescript, 
    // ...nextConfig,
    
    {
 ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}];