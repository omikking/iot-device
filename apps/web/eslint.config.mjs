// UPDATE-TODO: Unify codemod changes with eslint config...
import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * ESLint flat config for the Web application
 *
 * Extends the shared Next.js configuration for React applications.
 */

const config = [
    ...next, ...nextCoreWebVitals, ...nextTypescript,
    // ...nextConfig,
    {
        ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
    },
    {
        rules: {
            // Apostrophes in JSX text content is fine
            "react/no-unescaped-entities": "off",

            // The following rules are part of eslint-plugin-react-hooks v7's React Compiler
            // integration. This project does not use the React Compiler, so these rules
            // produce false positives on valid, intentional patterns.
            "react-hooks/set-state-in-effect": "off",
            "react-hooks/incompatible-library": "off",

            // Allow short-circuit (&&) and ternary expressions used for side effects
            "@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
        },
    },
];

export default config;