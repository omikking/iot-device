const { resolve } = require("node:path");
const project = resolve(process.cwd(), "tsconfig.json");
const isProduction = process.env.NODE_ENV === "production";

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    // Very strict, especially @vercel/style-guide/eslint/typescript. Might be good to use this in the future.
    // ...[
    //   "@vercel/style-guide/eslint/node",
    //   "@vercel/style-guide/eslint/typescript",
    //   "@vercel/style-guide/eslint/browser",
    //   "@vercel/style-guide/eslint/react",
    //   "@vercel/style-guide/eslint/next",
    // ].map(require.resolve),
    // "turbo",

    // Default Turbo next eslint config START
    "eslint:recommended",
    "prettier",
    require.resolve("@vercel/style-guide/eslint/next"),
    // TODO: re-enable after updating ESLint.  After updating it breaks and I think the problem is that eslint-config-turbo version 2.5.8 uses ES module exports with a default export, but ESLint in legacy mode expects a CommonJS module export. Might be fixed by itself when updating ESLint. error: Unexpected top-level property "default".
    // "turbo",
    "plugin:@typescript-eslint/recommended",
    // Default Turbo next eslint config END
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
      node: {
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
  },
  overrides: [
    {
      files: "*.tsx",
      rules: {
        // Note: docs state you must disable the base rule as it can report incorrect errors
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": isProduction ? "error" : "warn",
      },
    }
  ]
};
